db.visitas.aggregate([
	{
		$unwind: '$tempos',
	},
	{
		$group: {
			_id: '$tempos.sala',
			average: {
				$avg: '$tempos.tempo',
			},
		},
	},
	{
		$sort: {
			average: -1,
		},
	},
	{
		$limit: 1,
	},
]);