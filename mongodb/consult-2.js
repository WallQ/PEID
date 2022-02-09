db.visitas.aggregate([
	{
		$group: {
			_id: {
				localidade: '$localidade',
				gift: '$gift',
			},
			sum: {
				$sum: 1,
			},
		},
	},
	{
		$group: {
			_id: '$_id.localidade',
			gifts: {
				$push: {
					name: '$_id.gift',
					count: '$sum',
				},
			},
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
			gifts: '$gifts',
		},
	},
]);