import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    // map createdAt -> created_at for Postgres
    const payload = { ...(body as Record<string, unknown>) } as Record<string, unknown>;
    if (payload.createdAt) {
      payload.created_at = typeof payload.createdAt === 'string' ? payload.createdAt : String(payload.createdAt);
      delete payload.createdAt;
    }
    const { data, error } = await supabase.from('tasks').insert([payload]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { id, ...patch } = body;
    const payload = { ...(patch as Record<string, unknown>) } as Record<string, unknown>;
    if (payload.createdAt) {
      payload.created_at = typeof payload.createdAt === 'string' ? payload.createdAt : String(payload.createdAt);
      delete payload.createdAt;
    }
    const { data, error } = await supabase.from('tasks').update(payload).eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = getServiceSupabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const { data, error } = await supabase.from('tasks').delete().eq('id', id).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
