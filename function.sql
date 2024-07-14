create or replace function match_ollama (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  body text,
  similarity float
)
language sql stable
as $$
  select
    ollama.id,
    ollama.content,
    ollama.embedding,
    1 - (ollama.embedding <=> query_embedding) as similarity
  from ollama
  where 1 - (ollama.embedding <=> query_embedding) > match_threshold
  order by (ollama.embedding <=> query_embedding) asc
  limit match_count;
$$;
