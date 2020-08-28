'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  db.createTable('account', {
    columns: {
      id: { type: 'string', primaryKey: true, notNull: true },
      name: { type: 'string', length: 50, notNull: true },
      registration_time: { type: 'timestamp', notNull: true },
      is_online: { type: 'boolean' },
      lastOnline: { type: 'boolean' },
      description: { type: 'string', length: 150 },
      passw_hashed: { type: 'string', notNull: true },
      type: { type: 'string', notNull: true },
      email: { type: 'string', length: 150, notNull: true},
      confirmed: { type: 'boolean', notNull: true },
      photo: { type: 'string' }
    }
  });
  db.createTable('bookmark', {
    columns: {
      account: { 
        type: 'string', 
        primaryKey: true, 
        notNull: true,
        foreignKey: {
          name: 'account',
          table: 'account',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE'
          }
        }
      },
      mangaKey: { 
        type: 'bigint', 
        notNull: true,
        foreignKey: {
          name: 'manga_key',
          table: 'manga',
          mapping: 'manga_key',
          rules: {
            onDelete: 'CASCADE'
          }
        }
       },
      chapter: { type: 'int' },
      page: { type: 'int' },
      type: { type: 'string', notNull: true },
      time_added: { type: 'timestamp', notNull: true }
    }
  });
  db.createTable('chapter', {
    columns: {
      chapter_key: { type: 'bigint', primaryKey: true, notNull: true },
      manga_key: { 
        type: 'bigint', 
        notNull: true,
        foreignKey: {
          name: 'manga_key',
          table: 'manga',
          mapping: 'manga_key',
          rules: {
            onDelete: 'CASCADE'
          }
        }
      },
      name: { type: 'string', length: 150, notNull: true },
      number: { type: 'int', notNull: true },
      volume: { type: 'int' },
      add_time: { type: 'timestamp', notNull: true },
      pages_count: { type: 'int', notNull: true }
    }
  });
  db.createTable('comment', {
    columns: {
      author: { type: 'string', notNull: true },
      text: { type: 'string', notNull: true, length: 1000 },
      rating: { type: 'int', notNull: true },
      time_added: { type: 'timestamp', notNull: true },
      page_num: { 
        type: 'int', 
        notNull: true,
        foreignKey: {
          name: 'page_num',
          table: 'manga_page',
          mapping: 'page_number'
        }
      },
      chapter_key: { 
        type: 'bigint', 
        notNull: true,
        foreignKey: {
          name: 'chapter_key',
          table: 'manga_page',
          mapping: 'chapter_key'
        }
      },
      comment_id: { type: 'string', notNull: true, primaryKey: true },
      answer_on: { 
        type: 'string',
        foreignKey: {
          name: 'reply',
          table: 'comment',
          mapping: 'comment_id'
        }
      }
    }
  });
  db.create('comment_vote', {
    columns: {
      comment_id: { type: 'string', notNull: true, primaryKey: true },
      account_id: { type: 'string', notNull: true, primaryKey: true },
      vote: { type: 'int', notNull: true }
    }
  });
  db.create('manga', {
    columns: {
      name: { type: 'string', length: 100, notNull: true },
      author: { type: 'string', length: 100, notNull: true },
      description: { type: 'string', length: 1500, notNull: true },
      manga_key: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      create_time: { type: 'date', notNull: true },
      last_modify_time: { type: 'date' },
      thumbnail: { type: 'string', length: 100 },
      time_completed: { type: 'date' },
      manga_status: { type: 'string', notNull: true },
      bookmarks_count: { type: 'int', notNull: true }
    }
  });
  db.create('manga_page', {
    columns: {
      chapter_key: { 
        type: 'bigint', 
        notNull: true, 
        primaryKey: true,
        foreignKey: {
          name: 'chapter_key',
          table: 'chapter',
          mapping: 'chapter_key'
        }      
      },
      page_number: { type: 'int', notNull: true, primaryKey: true },
      image: { type: 'string', notNull: true, length: 60 }
    }
  });
  db.create('notification', {
    columns: {
      account_id: { 
        type: 'string', 
        notNull: true,
        foreignKey: {
          name: 'account',
          table: 'account',
          mapping: 'id'
        }
       },
      text: { type: 'string', notNull: true },
      readen: { type: 'boolean', notNull: true },
      author: { 
        type: 'string',
        foreignKey: {
          name: 'author',
          table: 'account',
          mapping: 'id'
        }
      },
      id: { type: 'string', notNull: true },
      link: { type: 'string' }
    }
  });
  db.create('passw_change_tokens', {
    columns: {
      id: { 
        type: 'string', 
        primaryKey: true,
        foreignKey: {
          name: 'id',
          table: 'account',
          mapping: 'id'
        }
      },
      token: { type: string }
    }
  });
  db.create('profile_photos', {
    columns: {
      id: { 
        type: 'string', 
        notNull: true,
        foreignKey: {
          name: 'id',
          table: 'account',
          mapping: 'id'
        }
      },
      photo: { type: 'string', length: 60 },
      file_format: { type: 'string', length: 15 }
    }
  });
  db.create('salts', {
    columns: {
      id: { 
        type: 'string', 
        notNull: true,
        foreignKey: {
          name: 'id',
          table: 'account',
          mapping: 'id'
        }
      },
      salt: { type: 'string', notNull: true }
    }
  });
  db.create('user_registration', {
    columns: {
      id: { 
        type: 'string', 
        notNull: true,
        foreignKey: {
          name: 'id',
          table: 'account',
          mapping: 'id'
        }
      },
      token_create_time: { type: 'timestamp', notNull: true },
      token: { type: 'string', notNull: true }
    }
  });
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
