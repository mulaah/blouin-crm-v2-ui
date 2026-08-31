import { query } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prospectId = params.id;

    // Prospect
    const prospectResult = await query(
      `SELECT
        p.*,
        ll_program.label as program_label,
        ll_category.label as client_category_label,
        ll_dossier_type.label as dossier_type_label
      FROM prospects_persons p
      LEFT JOIN lookup_values lv_program ON p.program_code = lv_program.code
        AND lv_program.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
      LEFT JOIN lookup_labels ll_program ON lv_program.id = ll_program.value_id AND ll_program.language = 'fr'
      LEFT JOIN lookup_values lv_category ON p.client_category_code = lv_category.code
        AND lv_category.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'client_category')
      LEFT JOIN lookup_labels ll_category ON lv_category.id = ll_category.value_id AND ll_category.language = 'fr'
      LEFT JOIN lookup_values lv_dossier_type ON p.dossier_type_pricing_code = lv_dossier_type.code
        AND lv_dossier_type.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'dossier_type_pricing')
      LEFT JOIN lookup_labels ll_dossier_type ON lv_dossier_type.id = ll_dossier_type.value_id AND ll_dossier_type.language = 'fr'
      WHERE p.id = $1`,
      [prospectId]
    );

    if (prospectResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Prospect not found' },
        { status: 404 }
      );
    }

    const prospect = prospectResult.rows[0];

    // Conventions
    const conventionsResult = await query(
      `SELECT
        c.id,
        c.matter_number,
        c.status,
        c.programme_code,
        ll_prog.label as programme_label,
        c.montant_ttc,
        c.date_signature
       FROM conventions c
       LEFT JOIN lookup_values lv_prog ON c.programme_code = lv_prog.code
         AND lv_prog.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
       LEFT JOIN lookup_labels ll_prog ON lv_prog.id = ll_prog.value_id AND ll_prog.language = 'fr'
       WHERE c.prospect_id = $1 ORDER BY c.created_at DESC`,
      [prospectId]
    );

    // Demandes
    const demandesResult = await query(
      `SELECT
        d.id,
        d.programme,
        ll_prog.label as programme_label,
        d.categorie,
        ll_cat.label as categorie_label,
        d.type_dossier,
        ll_type.label as type_dossier_label,
        d.statut,
        d.date_completion
       FROM demandes d
       LEFT JOIN lookup_values lv_prog ON d.programme = lv_prog.code
         AND lv_prog.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'program')
       LEFT JOIN lookup_labels ll_prog ON lv_prog.id = ll_prog.value_id AND ll_prog.language = 'fr'
       LEFT JOIN lookup_values lv_cat ON d.categorie = lv_cat.code
         AND lv_cat.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'client_category')
       LEFT JOIN lookup_labels ll_cat ON lv_cat.id = ll_cat.value_id AND ll_cat.language = 'fr'
       LEFT JOIN lookup_values lv_type ON d.type_dossier = lv_type.code
         AND lv_type.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'dossier_type_pricing')
       LEFT JOIN lookup_labels ll_type ON lv_type.id = ll_type.value_id AND ll_type.language = 'fr'
       WHERE d.prospect_id = $1 ORDER BY d.created_at DESC`,
      [prospectId]
    );

    // Consultations
    const consultationsResult = await query(
      `SELECT id, date_rdv, duree, prix_ttc, paiement_statut, date_paiement
       FROM consultations WHERE prospect_id = $1 ORDER BY date_rdv DESC`,
      [prospectId]
    );

    // Antécédents
    const antecedentsResult = await query(
      `SELECT
        a.id,
        a.antecedent_type_code,
        ll_type.label as antecedent_type_label,
        a.year_month,
        a.description,
        a.status
       FROM antecedents a
       LEFT JOIN lookup_values lv_type ON a.antecedent_type_code = lv_type.code
         AND lv_type.category_id = (SELECT id FROM lookup_categories WHERE category_key = 'type_antecedent')
       LEFT JOIN lookup_labels ll_type ON lv_type.id = ll_type.value_id AND ll_type.language = 'fr'
       WHERE a.prospect_id = $1 ORDER BY a.created_at DESC`,
      [prospectId]
    );

    return NextResponse.json({
      success: true,
      data: {
        prospect,
        conventions: conventionsResult.rows,
        demandes: demandesResult.rows,
        consultations: consultationsResult.rows,
        antecedents: antecedentsResult.rows,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching prospect:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
