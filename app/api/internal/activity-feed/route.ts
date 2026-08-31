import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prospectId = searchParams.get('prospect_id');
    const limit = parseInt(searchParams.get('limit') || '50');

    let sql = `
      SELECT
        af.id,
        af.description,
        af.table_name,
        af.action_type,
        af.created_at,
        s.first_name,
        s.last_name,
        s.email,
        pp.first_name as prospect_first_name,
        pp.last_name as prospect_last_name
      FROM activity_feed af
      LEFT JOIN staff s ON af.created_by = s.id
      LEFT JOIN prospects_persons pp ON af.prospect_id = pp.id
    `;

    const params: any[] = [];

    if (prospectId) {
      sql += ` WHERE af.prospect_id = $1`;
      params.push(prospectId);
    }

    sql += ` ORDER BY af.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);

    return NextResponse.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching activity feed:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
