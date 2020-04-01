exports.up = function(knex) {
	return knex.schema
		.createTable('rooms', tbl => {
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
			tbl.boolean('visited');
			tbl.string('n_to');
			tbl.string('s_to');
			tbl.string('e_to');
			tbl.string('w_to');
		})
		.createTable('stack', tbl => {
			tbl.increments();
			tbl.string('directions');
		});
};

exports.down = function(knex) {
	return knex.schema.dropTableIfExists('rooms');
};
