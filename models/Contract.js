const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class Contract {
  static async create(contractData) {
    const { data, error } = await supabase
      .from('contracts')
      .insert([{
        contract_id: contractData.contract_id,
        client_name: contractData.client_name,
        status: contractData.status,
        content: contractData.content
      }])
      .select()
      .single();

    console.log("Inside Contract.js create, data", data);
    console.log("Inside Contract.js create, error", error);

    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('contracts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async find(query, page = 1, limit = 10) {
    let supabaseQuery = supabase
      .from('contracts')
      .select('*', { count: 'exact' });

    if (query.status) {
      supabaseQuery = supabaseQuery.eq('status', query.status);
    }
    if (query.client_name) {
      supabaseQuery = supabaseQuery.ilike('client_name', `%${query.client_name}%`);
    }
    if (query.contract_id) {
      supabaseQuery = supabaseQuery.eq('contract_id', query.contract_id);
    }

    const { data, count, error } = await supabaseQuery
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { contracts: data, count };
  }

  static async update(id, updates) {
    const { data, error } = await supabase
      .from('contracts')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('contracts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}

module.exports = Contract; 