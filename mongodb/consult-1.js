db.visitas.aggregate([
	{
		$match: {
			idade: {
				$gt: 50,
			},
		},
	},
	{
		$count: 'Número total de visitantes com mais de 50:',
	},
]);