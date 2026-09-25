# GMBQYN API contract

Laravel 10+/11 implementation target for the Next.js frontend in this repo.

The frontend talks to this API through exactly one seam: `GmbqynService` in
[`lib/gmbqyn/service.ts`](../../lib/gmbqyn/service.ts). There are two
implementations:

| Implementation | File | When it is used |
| --- | --- | --- |
| HTTP (Laravel) | [`lib/gmbqyn/api.ts`](../../lib/gmbqyn/api.ts) | `NEXT_PUBLIC_GMBQYN_API_URL` or `GMBQYN_API_URL` is non-empty |
| Browser mock | [`lib/gmbqyn/mock.ts`](../../lib/gmbqyn/mock.ts) | otherwise |

Because the UI never calls `fetch` directly, this document defines the required
endpoint set. Response shapes are the TypeScript interfaces in
[`lib/gmbqyn/types.ts`](../../lib/gmbqyn/types.ts) — a Laravel `Resource`
serialising to snake_case matches them field-for-field.

## Configuration

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_GMBQYN_API_URL` | build/runtime | Base URL, e.g. `https://api.example.com/gmbqyn`. Embedded in the browser bundle. |
| `GMBQYN_API_URL` | server | Same value, read server-side. Takes precedence when both are set. |
| `GMBQYN_WEB_ORIGIN` | Laravel | Allowed CORS origin, e.g. `https://www.example.com`. |

No API key is used. Authentication is a bearer token, so
`NEXT_PUBLIC_GMBQYN_API_URL` is safe to expose to the browser.

## Conventions

- **Base path** — all paths below are relative to the configured base URL.
- **Prefixes** — `/auth`, `/customer`, and `/admin` require a bearer token.
  `/public` is unauthenticated.
- **Auth header** — `Authorization: Bearer <token>`, where `<token>` is the
  `token` field of the `Session` object returned by login and register.
- **Content type** — `application/json` on every request and response.
- **Datetime format** — ISO-8601 UTC, e.g. `2026-01-31T09:15:00Z`. Dates are
  `YYYY-MM-DD`.
- **Money** — JSON numbers in major units (rupees, not paise).
- **Booleans** — Laravel `true`/`false`, not `0`/`1`. The mock follows this.

### Error shape

Any non-2xx response must serialise to:

```json
{
  "message": "Email or password is incorrect.",
  "errors": { "email": ["This email is already registered."] },
  "status": 422
}
```

`message` is a human-readable sentence — the UI shows it verbatim.
`errors` is optional and only present for validation failures. `status` mirrors
the HTTP status code. This is the `ApiError` interface and
`GmbqynApiError` in `lib/gmbqyn/api.ts`.

### Pagination

List endpoints return:

```json
{ "data": [], "total": 0, "page": 1, "per_page": 20 }
```

That is `ListResult<T>`. The UI paginates on `page`/`per_page` and renders
`total`.

### Enum values

The API returns the strings listed in `types.ts`, not the numeric ids used in
the database schema. Resolve lookup-table ids in a model accessor or an
Eloquent cast:

| Field | Values |
| --- | --- |
| `User.role` / `status` | `customer`\|`admin`, `active`\|`invited`\|`suspended` |
| `Business.status` | `pending`\|`active`\|`suspended` |
| `Subscription.status` | `trial`\|`active`\|`past_due`\|`expired`\|`cancelled` |
| `Subscription.billing_cycle` | `monthly`\|`yearly` |
| `Payment.method` | `cash`\|`upi`\|`bank_transfer`\|`card`\|`cheque` |
| `Payment.status` | `pending`\|`verified`\|`failed`\|`refunded` |
| `Review.source` | `qr`\|`link`\|`manual`\|`import` |
| `Review.status` | `pending`\|`approved`\|`rejected`\|`flagged` |
| `Feedback.status` | `new`\|`in_progress`\|`resolved`\|`spam` |

`status: "all"` is a query-string-only sentinel meaning "no filter"; it is
never a valid stored value.

### Query parameters

`qs()` in `api.ts` appends params only when defined, so every list endpoint
treats all of these as optional.

| Param | Applies to | Notes |
| --- | --- | --- |
| `status` | all `list*` | An enum value, or `all`. |
| `q` | businesses, customers, reviews, subscriptions, payments | Case-insensitive substring search. |
| `range` | analytics | Preset key: `7d`, `30d`, `90d`, `12m`. |
| `page`, `per_page` | all `list*` | 1-indexed. Default `per_page` 20. |

## Endpoints

### Public — no auth

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/public/businesses/{slug}` | `PublicBusiness` |
| `POST` | `/public/businesses/{slug}/reviews` | `Review` |

`PublicBusiness` is intentionally narrow — it exposes only what a review form
needs: `name`, `slug`, `category`, `logo_url`, `rating`, `review_count`, and
`google_review_url`. Never leak `user_id`, `status`, or `google_place_id` here.

`POST .../reviews` accepts `customer_name` (required) and `rating` (required,
1–5), plus optional `title`, `comment`, `customer_email`, `customer_phone`.
On success: set `source` to `link`, `status` to `pending`, and increment
`review_links.submissions`. Return `422` if `review_link_enabled` is false or
the slug is unknown.

`GET` is reached from `app/gmbqyn/r/[slug]/page.tsx`, which is a dynamic route
(`ƒ (Dynamic)` in the build output).

### Auth

| Method | Path | Auth | Returns |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | none | `Session` |
| `POST` | `/auth/login` | none | `Session` |
| `POST` | `/auth/logout` | token | `null` |
| `GET` | `/auth/me` | token | `Session` |
| `PATCH` | `/auth/profile` | token | `User` |
| `POST` | `/auth/password` | token | `null` |

`POST /auth/register` takes a `RegisterPayload`: `name`, `email`, `phone`,
`password`, `business_name`, `category`, `city`, `state`, `country`,
`plan_code`, `billing_cycle`. It must create the user, the business, its
`review_links` row, and a `trial` subscription in one transaction, then return
a full `Session`. Return `422` with an `errors.email` array on a duplicate
email.

`Session` is `{ token, user, business, subscription }`. `business` and
`subscription` are `null` for a user with no linked business.

### Customer

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/customer/dashboard` | `CustomerDashboard` |
| `GET` | `/customer/business` | `Business` |
| `PATCH` | `/customer/business` | `Business` |
| `GET` | `/customer/review-link` | `ReviewLink` |
| `PATCH` | `/customer/review-link` | `ReviewLink` |
| `POST` | `/customer/review-link/reset` | `ReviewLink` |
| `GET` | `/customer/reviews` | `ListResult<Review>` |
| `POST` | `/customer/reviews` | `Review` |
| `PATCH` | `/customer/reviews/{id}` | `Review` |
| `DELETE` | `/customer/reviews/{id}` | `null` |
| `GET` | `/customer/feedback` | `ListResult<Feedback>` |
| `POST` | `/customer/feedback` | `Feedback` |
| `GET` | `/customer/analytics` | `BusinessAnalytics` |
| `GET` | `/customer/google` | `GoogleProfile` |
| `POST` | `/customer/google/connect` | `GoogleProfile` |
| `POST` | `/customer/google/sync` | `{ synced, message }` |
| `GET` | `/customer/subscription` | `Subscription \| null` |
| `POST` | `/customer/subscription/change` | `Subscription` |
| `POST` | `/customer/subscription/cancel` | `Subscription` |
| `GET` | `/customer/invoices` | `ListResult<Payment>` |

Every `/customer/*` route must scope queries to the caller's own
`business_id` — derive it from the token, never from the request body. A
`404` (not a `403`) is the conventional response for another tenant's row.

`PATCH /customer/review-link` takes `{ is_active, slug? }`. Slug changes must
keep uniqueness and update `review_links.slug` and `businesses.slug` together.

`CustomerDashboard` is a single aggregate the UI renders whole — it embeds
`business`, `subscription` (with nested `plan`), `review_link`, `totals`,
`rating_breakdown`, `series`, `recent_reviews`, `plan_usage`, and
`days_to_renewal`. Implement it as one query per bullet, not N+1.

`GET /customer/analytics?range=30d` returns `BusinessAnalytics`, which also
echoes the resolved `range` and embeds `rating_breakdown`, `series`, and
`sources`. Back `series` with `business_daily_metrics`.

`Subscription` embeds an optional `plan`. Always eager-load it — the
subscription and plan-change screens both read `plan.price_monthly`.

### Master Admin

Every route requires `role = admin`; return `403` otherwise.

| Method | Path | Returns |
| --- | --- | --- |
| `GET` | `/admin/overview` | `AdminOverview` |
| `GET` | `/admin/analytics` | `AdminAnalytics` |
| `GET` | `/admin/series` | `AnalyticsPoint[]` |
| `GET` | `/admin/businesses` | `ListResult<Business>` |
| `PATCH` | `/admin/businesses/{id}/status` | `Business` |
| `DELETE` | `/admin/businesses/{id}` | `null` |
| `GET` | `/admin/customers` | `ListResult<User>` |
| `PATCH` | `/admin/customers/{id}/status` | `User` |
| `DELETE` | `/admin/customers/{id}` | `null` |
| `GET` | `/admin/subscriptions` | `ListResult<Subscription>` |
| `POST` | `/admin/subscriptions` | `Subscription` |
| `PATCH` | `/admin/subscriptions/{id}` | `Subscription` |
| `POST` | `/admin/subscriptions/{id}/cancel` | `Subscription` |
| `POST` | `/admin/subscriptions/{id}/renew` | `Subscription` |
| `GET` | `/admin/payments` | `ListResult<Payment>` |
| `POST` | `/admin/payments` | `Payment` |
| `PATCH` | `/admin/payments/{id}/status` | `Payment` |
| `DELETE` | `/admin/payments/{id}` | `null` |
| `GET` | `/admin/reviews` | `ListResult<Review>` |
| `PATCH` | `/admin/reviews/{id}/status` | `Review` |
| `GET` | `/admin/feedback` | `ListResult<Feedback>` |
| `PATCH` | `/admin/feedback/{id}/status` | `Feedback` |
| `DELETE` | `/admin/feedback/{id}` | `null` |
| `GET` | `/admin/plans` | `Plan[]` |
| `POST` | `/admin/plans` | `Plan` |
| `PUT` | `/admin/plans/{id}` | `Plan` |
| `DELETE` | `/admin/plans/{id}` | `null` |
| `GET` | `/admin/settings` | `Settings` |
| `PATCH` | `/admin/settings` | `Settings` |
| `POST` | `/admin/demo/reset` | `null` |

Billing is **manual by design** — there is no payment gateway. `POST
/admin/payments` records a customer-initiated transfer (UPI, bank transfer,
cheque, cash) that an operator then marks `verified`. `POST
/admin/subscriptions/{id}/renew` takes `{ months }` and shifts
`current_period_start`/`current_period_end` forward. Neither route should
attempt to charge anything.

`GET /admin/plans` returns a bare array, not a `ListResult`, because the plan
catalogue is small and fully cached in the UI.

`POST /admin/demo/reset` truncates demo data and re-seeds. Restrict it to
non-production; the mock's Profile screen calls it.

## Resource shapes not in `types.ts`

Two admin response types are declared next to the service interface rather than
in `types.ts`. Define them as `JsonResource`s:

```php
// AdminAnalytics
[
    'range' => '30d',
    'totals' => [
        'mrr' => 0.0,
        'arr' => 0.0,
        'collected' => 0.0,
        'outstanding' => 0.0,
        'churned' => 0,
        'new_businesses' => 0,
    ],
    'mrr_series' => [['label' => 'Oct', 'value' => 0.0], /* ... */],
    'revenue_series' => [['label' => 'Oct', 'value' => 0.0], /* ... */],
    'plan_split' => [['plan' => 'Growth', 'businesses' => 0, 'revenue' => 0.0], /* ... */],
]
```

`AdminOverview` and `AdminAnalytics.totals` are both defined in `types.ts`;
`AdminAnalytics` is the one declared in `service.ts:65-80`.

`ReviewLink` adds two derived fields the UI relies on:

- `url` — the full canonical review URL for the dashboard copy button.
- `short_url` — a `short_url`-style alias, `/r/{slug}` relative to the web app.
- `conversion_rate` — `submissions / max(clicks, 1) * 100`, rounded to 2 dp.
  The `v_business_live_stats` view already provides the raw columns.

## CORS and rate limiting

`GET /public/businesses/{slug}` and `POST /public/businesses/{slug}/reviews`
are unauthenticated and internet-facing. At minimum:

- Allow `GMBQYN_WEB_ORIGIN` only. Do not reflect arbitrary origins.
- Allow `GET, POST, OPTIONS`; allow the `Authorization, Content-Type` headers.
- Throttle the public POST to ~5 submissions per IP per minute, and the slug
  GET to ~60 per IP per minute. Reviews are the one place where a bot would
  visibly damage a customer's data.

## Suggested Laravel structure

```
app/
  Http/
    Controllers/
      AuthController.php
      PublicReviewController.php
      Customer/
        DashboardController.php
        BusinessController.php
        ReviewLinkController.php
        ReviewController.php
        FeedbackController.php
        AnalyticsController.php
        GoogleProfileController.php
        SubscriptionController.php
        InvoiceController.php
      Admin/
        OverviewController.php
        AnalyticsController.php
        BusinessController.php
        CustomerController.php
        SubscriptionController.php
        PaymentController.php
        ReviewController.php
        FeedbackController.php
        PlanController.php
        SettingsController.php
    Requests/
    Resources/
  Models/
    User, Business, ReviewLink, Plan, Subscription, Payment,
    Review, Feedback, BusinessDailyMetric, GoogleSyncLog
app/Support/
  GmbqynApiException.php   # renders the error shape above
database/
  migrations/
  schema.sql              # from ./schema.sql
routes/api.php
```

## Definition of done

- [ ] `schema.sql` applies cleanly to an empty MySQL 8 database.
- [ ] Every endpoint above returns the documented shape for both demo accounts.
- [ ] Enum fields serialise as strings, never as lookup ids.
- [ ] Non-2xx responses use the shared error shape.
- [ ] `/customer/*` cannot read or mutate another tenant's rows.
- [ ] `/admin/*` returns `403` for a `customer` token.
- [ ] `GET /public/businesses/{slug}` leaks no internal ids.
- [ ] Public review submission is rate-limited and idempotent on
      `(business_id, google_review_id)`.
- [ ] `getGmbqynService()` picks the HTTP adapter once the base URL is set,
      with no UI changes.
