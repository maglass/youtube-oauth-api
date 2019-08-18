
create table oauth_tokens (
	idx SERIAL PRIMARY key,
	scope VARCHAR(1000) not null,
	access_token VARCHAR(300) not null,
	refresh_token VARCHAR(300) not null,
	token_type VARCHAR(50) not null,
	expires_in INTEGER not null,
	created_at TIMESTAMP not null default current_timestamp,
	updated_at TIMESTAMP default current_timestamp
)

create sequence sequence_oauth_tokens_idx start 1 increment 1;
