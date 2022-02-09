db.visitas.aggregate([
	{
		$group: {
			_id: '$localidade',
			count: { $sum: 1 },
		},
	},
	{
		$lookup: {
			from: 'locations',
			localField: '_id',
			foreignField: '_id',
			as: 'localidade',
		},
	},
	{
		$project: {
			cidade: {
				$arrayElemAt: ['$localidade.city', 0],
			},
			count: 1,
		},
	},
]);