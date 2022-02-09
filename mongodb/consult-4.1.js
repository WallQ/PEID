db.visitas.aggregate([
	{
		$unwind: '$brindes',
	},
	{
		$group: {
			_id: '$brindes',
			count: {
				$sum: 1,
			},
		},
	},
	{
		$sort: {
			count: -1,
		},
	},
	{
		$limit: 5,
	},
]);