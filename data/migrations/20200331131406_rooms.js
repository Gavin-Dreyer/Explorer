exports.up = function(knex) {
	return knex.schema.createTable('rooms', tbl => {
		tbl.increments();
		tbl.integer('room_id');
		tbl.string('title');
		tbl.string('description');
		tbl.string('coordinates');
		tbl.integer('elevation');
		tbl.string('terrain');
		tbl.string('items');
		tbl.string('exits');
		tbl.string('messages');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('rooms');
};