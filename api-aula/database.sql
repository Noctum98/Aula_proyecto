CREATE DATABASE IF NOT EXISTS api_aula;

USE api_aula;

CREATE TABLE users(
    id int(255) auto_increment not null,
    name varchar(100) not null,
    surname varchar(150) not null,
    email varchar(255) not null,
    password varchar(255) not null,
    image varchar(200) default null,
    created_at datetime default null,
    updated_at datetime default null,
    remember_token varchar(255),

    CONSTRAINT pk_user PRIMARY KEY(id)
)ENGINE=InnoDb;

CREATE TABLE classrooms(
    id int(255) auto_increment not null,
    user_id int(255) not null,
    name varchar(200) not null,
    description text not null,
    code varchar(200) not null,
    image varchar(200) default null,
    created_at datetime default null,
    updated_at datetime default null,

    CONSTRAINT pk_classroom PRIMARY KEY(id),
    CONSTRAINT fk_classroom_user FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb;

CREATE TABLE members(
    id int(255) auto_increment not null,
    classroom_id int(255) not null,
    user_id int(255) not null,
    role varchar(200),
    created_at datetime default null,
    updated_at datetime default null,

    CONSTRAINT pk_member PRIMARY KEY(id),
    CONSTRAINT fk_member_classroom FOREIGN KEY(classroom_id) REFERENCES classrooms(id),
    CONSTRAINT fk_member_user FOREIGN KEY(user_id) REFERENCES users(id)
)ENGINE=InnoDb;

CREATE TABLE tasks(
    id int(255) auto_increment not null,
    classroom_id int(255) not null,
    title varchar(200) not null,
    content text not null,
    file varchar(200),
    created_at datetime default null,
    updated_at datetime default null,

    CONSTRAINT pk_task PRIMARY KEY(id),
    CONSTRAINT fk_task_classroom FOREIGN KEY(classroom_id) REFERENCES classrooms(id)
)ENGINE=InnoDb;

CREATE TABLE answers(
    id int(255) auto_increment not null,
    task_id int(255) not null,
    member_id int(255) not null,
    content text not null,
    file varchar(200),
    created_at datetime default null,
    updated_at datetime default null,

    CONSTRAINT pk_answer PRIMARY KEY(id),
    CONSTRAINT fk_answer_task FOREIGN KEY(task_id) REFERENCES tasks(id),
    CONSTRAINT fk_answer_member FOREIGN KEY(member_id) REFERENCES members(id) 
)ENGINE=InnoDb;