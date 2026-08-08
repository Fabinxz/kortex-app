-- Essays table for tracking redacao (essay) performance
CREATE TABLE IF NOT EXISTS essays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES kortex_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT now(),
  total_score INT NOT NULL CHECK (total_score >= 0 AND total_score <= 1000),
  comp1_score INT NOT NULL DEFAULT 0 CHECK (comp1_score >= 0 AND comp1_score <= 200),
  comp2_score INT NOT NULL DEFAULT 0 CHECK (comp2_score >= 0 AND comp2_score <= 200),
  comp3_score INT NOT NULL DEFAULT 0 CHECK (comp3_score >= 0 AND comp3_score <= 200),
  comp4_score INT NOT NULL DEFAULT 0 CHECK (comp4_score >= 0 AND comp4_score <= 200),
  comp5_score INT NOT NULL DEFAULT 0 CHECK (comp5_score >= 0 AND comp5_score <= 200),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_essays_user ON essays(user_id);
CREATE INDEX IF NOT EXISTS idx_essays_date ON essays(user_id, date);

-- Seed essay data (ENEM-style: 5 competencies, 0-200 each, total 0-1000)
INSERT INTO essays (user_id, title, date, total_score, comp1_score, comp2_score, comp3_score, comp4_score, comp5_score, notes) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Democratizacao do acesso a internet', now() - interval '90 days', 520, 120, 100, 100, 120, 80, 'Primeira tentativa. Dificuldade com proposta de intervencao.'),
  ('00000000-0000-0000-0000-000000000001', 'Estigma das doencas mentais', now() - interval '78 days', 560, 120, 120, 120, 120, 80, 'Melhora na argumentacao mas proposta ainda fraca.'),
  ('00000000-0000-0000-0000-000000000001', 'Invisibilidade e registro civil', now() - interval '65 days', 600, 140, 120, 120, 120, 100, 'Boa estrutura. Comp1 melhorou.'),
  ('00000000-0000-0000-0000-000000000001', 'Manipulacao do comportamento online', now() - interval '55 days', 580, 120, 120, 120, 120, 100, 'Dia ruim. Tema dificil, perdi tempo na intro.'),
  ('00000000-0000-0000-0000-000000000001', 'Desafios da educacao a distancia', now() - interval '45 days', 660, 140, 140, 140, 120, 120, 'Salto significativo. Repertorio socio-cultural melhor.'),
  ('00000000-0000-0000-0000-000000000001', 'Caminhos para combater o racismo', now() - interval '38 days', 640, 140, 120, 140, 120, 120, 'Comp2 precisa de mais coesao entre paragrafos.'),
  ('00000000-0000-0000-0000-000000000001', 'Falta de empatia na sociedade', now() - interval '30 days', 720, 160, 140, 140, 140, 140, 'Melhor nota ate agora. Proposta de intervencao mais detalhada.'),
  ('00000000-0000-0000-0000-000000000001', 'O papel da mulher na ciencia', now() - interval '22 days', 680, 140, 140, 140, 140, 120, 'Recuo leve. Proposta de intervencao genérica.'),
  ('00000000-0000-0000-0000-000000000001', 'Saude publica e obesidade', now() - interval '15 days', 740, 160, 160, 140, 140, 140, 'Novo recorde. Coesao entre paragrafos excelente.'),
  ('00000000-0000-0000-0000-000000000001', 'Impactos do garimpo ilegal', now() - interval '10 days', 760, 160, 160, 160, 140, 140, 'Consistencia. Repertorio diversificado.'),
  ('00000000-0000-0000-0000-000000000001', 'Abandono paterno no Brasil', now() - interval '5 days', 780, 160, 160, 160, 160, 140, 'Quase 800! Comp5 precisa ser mais especifica.'),
  ('00000000-0000-0000-0000-000000000001', 'Desigualdade no acesso a saude', now() - interval '1 day', 800, 160, 160, 160, 160, 160, 'META ATINGIDA. Todas competencias equilibradas.')
ON CONFLICT DO NOTHING;
