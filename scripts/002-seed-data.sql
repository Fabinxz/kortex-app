-- Seed demo user
INSERT INTO kortex_users (id, email, name)
VALUES ('00000000-0000-0000-0000-000000000001', 'demo@kortex.app', 'Demo User')
ON CONFLICT (email) DO NOTHING;

-- Seed subjects
INSERT INTO subjects (id, user_id, name, weight, color) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Matematica', 5, '#00ff41'),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Fisica', 4, '#00d4ff'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Quimica', 4, '#ffaa00'),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Biologia', 3, '#ff0055'),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Portugues', 3, '#aa55ff')
ON CONFLICT DO NOTHING;

-- Seed topics
INSERT INTO topics (id, subject_id, name, difficulty_level, is_wall_of_stone, status, mastery_score) VALUES
  -- Matematica
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Funcoes', 3, false, 'IN_PROGRESS', 65.0),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Geometria Analitica', 5, true, 'IN_PROGRESS', 22.0),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Probabilidade', 2, false, 'MASTERED', 92.0),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'Trigonometria', 4, true, 'TODO', 10.0),
  -- Fisica
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Eletrodinamica', 5, true, 'IN_PROGRESS', 18.0),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', 'Mecanica', 3, false, 'IN_PROGRESS', 55.0),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000002', 'Termodinamica', 4, true, 'TODO', 5.0),
  -- Quimica
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', 'Estequiometria', 3, false, 'IN_PROGRESS', 48.0),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', 'Quimica Organica', 4, true, 'TODO', 12.0),
  -- Biologia
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', 'Citologia', 2, false, 'MASTERED', 88.0),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', 'Genetica', 4, true, 'IN_PROGRESS', 30.0),
  -- Portugues
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000005', 'Interpretacao de Texto', 2, false, 'MASTERED', 85.0),
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000005', 'Gramatica', 3, false, 'IN_PROGRESS', 60.0)
ON CONFLICT DO NOTHING;

-- Seed study sessions (last 14 days)
INSERT INTO study_sessions (user_id, topic_id, duration_minutes, date, feynman_explanation) VALUES
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 90, now() - interval '13 days', 'Funcoes sao relacoes entre conjuntos onde cada entrada tem exatamente uma saida.'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 60, now() - interval '12 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000003', 45, now() - interval '11 days', 'Probabilidade mede a chance de eventos ocorrerem.'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 75, now() - interval '10 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 120, now() - interval '9 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000010', 30, now() - interval '8 days', 'Celulas sao as unidades fundamentais da vida.'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005', 90, now() - interval '7 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000012', 45, now() - interval '6 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000006', 80, now() - interval '5 days', 'F=ma define a relacao entre forca, massa e aceleracao.'),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 60, now() - interval '4 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000013', 45, now() - interval '3 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000011', 90, now() - interval '2 days', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 60, now() - interval '1 day', NULL),
  ('00000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000008', 75, now(), NULL)
ON CONFLICT DO NOTHING;

-- Seed bio logs (last 14 days)
INSERT INTO daily_bio_logs (user_id, date, sleep_hours, sleep_quality, exercise, clean_diet, mood) VALUES
  ('00000000-0000-0000-0000-000000000001', now() - interval '13 days', 7.5, 8, true, true, 8),
  ('00000000-0000-0000-0000-000000000001', now() - interval '12 days', 5.0, 4, false, false, 5),
  ('00000000-0000-0000-0000-000000000001', now() - interval '11 days', 8.0, 9, true, true, 9),
  ('00000000-0000-0000-0000-000000000001', now() - interval '10 days', 6.5, 6, false, true, 6),
  ('00000000-0000-0000-0000-000000000001', now() - interval '9 days', 7.0, 7, true, false, 7),
  ('00000000-0000-0000-0000-000000000001', now() - interval '8 days', 4.5, 3, false, false, 4),
  ('00000000-0000-0000-0000-000000000001', now() - interval '7 days', 8.5, 9, true, true, 9),
  ('00000000-0000-0000-0000-000000000001', now() - interval '6 days', 6.0, 5, false, true, 6),
  ('00000000-0000-0000-0000-000000000001', now() - interval '5 days', 7.0, 7, true, false, 7),
  ('00000000-0000-0000-0000-000000000001', now() - interval '4 days', 5.5, 4, false, false, 5),
  ('00000000-0000-0000-0000-000000000001', now() - interval '3 days', 8.0, 8, true, true, 8),
  ('00000000-0000-0000-0000-000000000001', now() - interval '2 days', 7.5, 7, true, true, 8),
  ('00000000-0000-0000-0000-000000000001', now() - interval '1 day', 6.0, 5, false, false, 6),
  ('00000000-0000-0000-0000-000000000001', now(), 7.0, 7, true, true, 7)
ON CONFLICT DO NOTHING;

-- Seed simulations
INSERT INTO simulations (id, user_id, name, date, total_score) VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'FUVEST 2024 - Fase 1', now() - interval '10 days', 72),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ENEM 2024 - Dia 1', now() - interval '5 days', 680),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'UNICAMP 2024 - Fase 2', now() - interval '2 days', 58)
ON CONFLICT DO NOTHING;

-- Seed question errors
INSERT INTO question_errors (topic_id, simulation_id, description, correction, error_type, date) VALUES
  ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 'Equacao da reta passando por dois pontos', 'Usar formula y-y1 = m(x-x1) onde m = (y2-y1)/(x2-x1)', 'CONCEPTUAL', now() - interval '10 days'),
  ('20000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 'Circuito com resistores em paralelo', 'Resistencia equivalente: 1/Req = 1/R1 + 1/R2', 'CALCULATION', now() - interval '10 days'),
  ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 'Funcao composta f(g(x))', 'Substituir g(x) em f primeiro, depois simplificar', 'INTERPRETATION', now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000002', 'Nomenclatura de hidrocarbonetos', 'Contar carbonos na cadeia principal, prefixo + terminacao', 'CONCEPTUAL', now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000002', 'Cruzamento dihibrido', 'Usar quadro de Punnett 4x4, calcular proporcoes fenotipicas', 'TIME', now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000003', 'Identidades trigonometricas', 'sen2(x) + cos2(x) = 1, usar para simplificar', 'EMOTIONAL', now() - interval '2 days'),
  ('20000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000003', 'Ciclo de Carnot', 'Rendimento = 1 - Tfria/Tquente (em Kelvin)', 'CONCEPTUAL', now() - interval '2 days'),
  ('20000000-0000-0000-0000-000000000006', NULL, 'Lancamento obliquo', 'Decompor velocidade em Vx e Vy, usar equacoes horarias', 'DISTRACTION', now() - interval '3 days'),
  ('20000000-0000-0000-0000-000000000008', NULL, 'Balanceamento por tentativa', 'Balancear metais primeiro, depois nao-metais, oxigenio e hidrogenio', 'CALCULATION', now() - interval '7 days'),
  ('20000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000003', 'Concordancia verbal com sujeito composto', 'Quando sujeito composto anteposto, verbo no plural', 'INTERPRETATION', now() - interval '2 days')
ON CONFLICT DO NOTHING;
