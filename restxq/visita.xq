module namespace page = 'http://basex.org/examples/web-page';

declare 
%updating  
%rest:path("visita/add")
%rest:POST("{$body}") 
function page:addOc($body) {
  
  let $xsd := "./visita.xsd"
  let $is_not_valid := validate:xsd($body, $xsd)
  
  let $database := db:open("visitas")
  
  let $generated_id := page:generateID()
  
  let $brinde := page:getMatchBrinde($body//brindes)
  
  let $new := <visita id= "{$generated_id}">
                {$body//data}
                {$body//numAmigos}
                {$body//localidade}
                {$body//idade}
                {$body//compras}
                {$body//brindes}
                <gift>{$brinde}</gift>
              </visita>
  
  return (
        if ($is_not_valid) then (fn:error(xs:QName("Validation"), "The XML is invalid")),
        (:if (not($database)) then (fn:error(xs:QName("Database"), "Database can't be open")),:)
        update:output(
          <response>
            <status>Success</status>
            <id_visita>{$generated_id}</id_visita>
            <brinde>{$brinde}</brinde>
          </response>),
        db:add("visitas", $new, "visitas.xml")
    )
};

(:Retornar a lista de produtos comprados:)
declare 
  %rest:path("visita/produtos/{$who}") 
  %rest:GET function page:getProdutos($who) {
  let $products := db:open("visitas") //produto
  for $p in distinct-values($products/descricao)
  return
  <produto>{$p}</produto>
};

(:Obter os dados dentro de <Visitas>:)
declare function page:getData(){
   let $visitas := db:open("visitas") //visita
   return <visitas>{$visitas}</visitas>  
};

(:Obter o ultimo id DEPRECATED!! for generateID:)
declare function page:getLastID(){
   let $products := db:open("visitas") //visita
   return if(exists($products[last()]/@id))
           then $products[last()]/@id + 1 
           else 0
};

(: Obter o ultimo ID disponivel:)
declare function page:generateID(){
   let $max := max(db:open("visitas") //visita/@id)
   return if(exists($max)) then $max + 1 else 1
 };
 
 (: Obter o Brinde a atribuir:)
declare function page:getMatchBrinde($lista){
   let $products := distinct-values(db:open("visitas") //produto/descricao)
   return if(exists($products[. = $lista/brinde][1]))
           then $products[. = $lista/brinde][1]
           else "Porta Chaves"
 };
 
 (:Exportal dadoss:) 
 declare 
 %rest:path("visita/exports")
 %rest:GET function page:exports() {   
   let $visitas := db:open("visitas")//visita   
   return page:getData() 
 };