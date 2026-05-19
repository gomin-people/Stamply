import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase/server';

export async function GET() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        message: '이벤트 조회 실패',
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    data,
  });
}
