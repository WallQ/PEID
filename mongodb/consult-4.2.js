db.visitas.aggregate([
	{
		$group: {
			_id: null,
			average: {
				$avg: '$numAmigos',
			},
		},
	},
]);