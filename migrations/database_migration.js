exports.up = (pgm) => {
  pgm.createTable('account', {
    id: { type: 'varchar(100)', notNull: true },
    name: { type: 'varchar(100)', notNull: true },
    registration_time: {
      type: 'timestamp',
      notNull: true,
    },
    is_online: {type: 'boolean'},
    last_online: {type: 'timestamp'},
    photo: {type: 'varchar(100)'},
    description: {type: 'varchar(150)'}
  })
  pgm.addConstraint('account', 'user_id', primaryKey, 'id')
  pgm.createTable('chapter', {
    chapter_key: {type:'bigint', notNull: true},
    manga_key: {
      type: 'bigint',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
      },
    name: {type: 'varchar(100)', notNull: true},
    number: {
      type: 'integer',
      notNull: true,
    },
    volume: 'integer',
    add_time: { 
      type: 'timestamp', 
      notNull: true, 
      default: pgm.func('current_timestamp'), 
    },
    pages_count: {
      type: 'integer',
      notNull: true,
    },
  })
}
