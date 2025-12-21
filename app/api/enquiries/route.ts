import { NextResponse } from 'next/server';

function disabled() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}

export async function POST() {
  return disabled();
}

export async function PATCH() {
  return disabled();
}

export async function GET() {
  return disabled();
}
