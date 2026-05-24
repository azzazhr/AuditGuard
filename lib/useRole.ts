'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRole() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        setRole((profile?.role as 'admin' | 'user') || 'user');
        localStorage.setItem('userRole', profile?.role || 'user');
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  return { role, isAdmin, isUser, loading };
}
