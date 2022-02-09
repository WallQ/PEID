//Converter tipos de dados dos campos
db.visitas.aggregate([
	{ $addFields: { '@id': { $toInt: '$@id' } } },
	{ $addFields: { numAmigos: { $toInt: '$numAmigos' } } },
	{ $addFields: { idade: { $toInt: '$idade' } } },
	{ $addFields: { data: { $toDate: '$data' } } },
	{ $out: 'visitas' },
]);

//Converter Preçoproduto para inteiro [Array]
var docs = db.visitas.aggregate([
	{ $unwind: '$compras' },
	{ $addFields: { 'compras.preco': { $toDecimal: '$compras.preco' } } },
	{ $group: { _id: '$_id', compras: { $push: '$compras' } } },
]);

docs.forEach(function (doc) {
	db.visitas.updateOne({ _id: doc._id }, { $set: { compras: doc.compras } });
});

//Associar localidades
var docs = db.visitas.aggregate([
	{ $project: { _id: 1, localidade: 1 } },
	{
		$lookup: {
			from: 'locations',
			localField: 'localidade',
			foreignField: 'city',
			as: 'locations',
		},
	},
	{ $unwind: { path: '$locations' } },
]);

docs.forEach(function (doc) {
	db.visitas.updateOne({ _id: doc._id }, { $set: { localidade: doc._id } });
});

//Realizar para os Produtos??

//Inserir tempos

db.visitas.updateOne(
	{ '@id': 1 },
	{
		$set: {
			tempos: [
				{ sala: 's1', tempo: 5 },
				{ sala: 's2', tempo: 7 },
				{ sala: 's3', tempo: 8 },
				{ sala: 's4', tempo: 9 },
				{ sala: 's5', tempo: 2 },
			],
		},
	}
);
