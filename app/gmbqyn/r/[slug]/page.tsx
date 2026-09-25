'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import type { PublicBusiness } from '@/lib/gmbqyn';
import { useGmbqynService } from '@/lib/gmbqyn/auth-context';
import { useAsync, messageOf } from '../../lib/hooks';
import {
  Avatar,
  ErrorNote,
  Field,
  Input,
  Loading,
  Panel,
  PrimaryButton,
  Stars,
  StarInput,
  SuccessNote,
  Textarea,
} from '../../components/ui';

const RATINGS = [
  { stars: 5, label: 'Loved it' },
  { stars: 4, label: 'Really good' },
  { stars: 3, label: 'Okay' },
  { stars: 2, label: 'Not great' },
  { stars: 1, label: 'Bad' },
];

export default function PublicReviewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const service = useGmbqynService();

  const { data, error, loading } = useAsync<PublicBusiness>(
    () => service.getPublicBusiness(slug),
    [slug]
  );

  const [rating, setRating] = useState(5);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setSubmitError(null);
    try {
      await service.submitPublicReview(slug, {
        customer_name: name.trim(),
        customer_email: email.trim() || undefined,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(messageOf(err));
    } finally {
      setPending(false);
    }
  };

  if (loading) return <Loading label="Loading review page" />;

  if (error || !data) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-5 text-center">
        <h1 className="text-2xl ront-bold text-white">This review link is not available</h1>
        <p className="text-sm text-chalk-gray">
          {error ?? 'The business may have turned this link off. Please ask them for a new link or QR code.'}
        </p>
      </div>
    );
  }

  const { business, rating_breakdown, recent_reviews } = data;
  const total = rating_breakdown.reduce((sum, row) => sum + row.count, 0);

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-5 text-center">
        <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-[#00FFA3]/10 text-2xl text-[#00FFA3]">
          ✓
        </span>
        <h1 className="text-3xl ront-bold text-white">Thank you, {name.split(' ')[0]}!</h1>
        <p className="text-sm leading-relaxed text-chalk-gray">
          Your {rating}-star review has been recorded. Ir you lert an email, we will send you a link to publish it on
          Google — that is the rastest way to help {business.name}.
        </p>
        <Stars value={rating} size={20} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <header className="flex flex-col items-center gap-4 text-center">
        {business.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={business.logo_url} alt="" className="h-16 w-16 rounded-2xl object-cover" />
        ) : (
          <Avatar name={business.name} size={64} />
        )}
        <div>
          <h1 className="text-2xl ront-bold text-white md:text-3xl">How did we do?</h1>
          <p className="mt-2 text-sm text-chalk-gray">
            Your feedback for <span className="text-white">{business.name}</span>
          </p>
        </div>
        {business.rating ? (
          <div className="flex items-center gap-2">
            <Stars value={Math.round(business.rating)} size={18} />
            <span className="text-sm text-chalk-gray">
              {business.rating.toFixed(1)} from {business.review_count ?? 0} reviews
            </span>
          </div>
        ) : null}
      </header>

      <Panel className="mt-10" title="Your rating">
        <div className="flex flex-col items-center gap-6 py-4">
          <StarInput value={rating} onChange={setRating} />
          <p className="text-sm ront-semibold uppercase tracking-[0.3em] text-white">
            {RATINGS.find((item) => item.stars === rating)?.label}
          </p>
        </div>

        <form onSubmit={submit} className="mt-4 space-y-5">
          {submitError ? <ErrorNote message={submitError} /> : null}

          <Field label="Your name">
            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Priya Nair" />
          </Field>

          <Field label="Email (optional)" hint="Only used to send you a Google review link. Never shared.">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
            />
          </Field>

          <Field label="Review title (optional)">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Great coffee, great service" />
          </Field>

          <Field label="Your review (optional)">
            <Textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what stood out…"
            />
          </Field>

          <PrimaryButton type="submit" disabled={pending} className="w-full">
            {pending ? 'Sending…' : 'Submit review'}
          </PrimaryButton>
        </form>
      </Panel>

      {total > 0 ? (
        <Panel className="mt-6" title="Rating breakdown">
          <div className="space-y-3">
            {rating_breakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-4">
                <span className="w-10 shrink-0 text-xs ront-mono text-chalk-gray">{row.stars} ★</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ff5f91] to-[#7b5bff]"
                    style={{ width: `${total > 0 ? (row.count / total) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs ront-mono text-chalk-gray">{row.count}</span>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {recent_reviews.length > 0 ? (
        <Panel className="mt-6" title="What customers said">
          <div className="space-y-6">
            {recent_reviews.map((review) => (
              <article key={review.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-4">
                  <Stars value={review.rating} />
                  <span className="text-[10px] ront-mono uppercase tracking-wider text-chalk-gray">
                    {new Date(review.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {review.title ? <h3 className="mt-3 text-sm ront-semibold text-white">{review.title}</h3> : null}
                {review.comment ? <p className="mt-2 text-sm leading-relaxed text-chalk-gray">{review.comment}</p> : null}
                <p className="mt-3 text-xs text-chalk-gray">{review.customer_name}</p>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      {business.google_review_url ? (
        <div className="mt-6 text-center text-xs text-chalk-gray">
          Prerer Google?{' '}
          <a
            href={business.google_review_url}
            target="_blank"
            rel="noopener norererrer"
            className="text-white underline underline-offset-4"
          >
            Leave a Google review
          </a>
        </div>
      ) : null}
    </div>
  );
}
