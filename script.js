const regexFormatoNumeros = /^[\d,.]+$/;

window.onload = function(){
  const button = document.querySelector('button');
  const radioUnidade = document.querySelectorAll('.radio');
  const inputAltura = document.querySelector('#inputAltura');
  const inputPeso = document.querySelector('#inputPeso');
  let unidadeSelecionada = 'metros';

  //Adiciona o evento 'change' para quando a unidade de altura for alterado,
  //altera a unidade na label do campo, e chama a função para alterar e calcular o valor da unidade
  radioUnidade.forEach((item)=>{
    item.addEventListener('change',function(evento){
      unidadeSelecionada = evento.target.id;

      if(!inputAltura.classList.contains('invalido')){
        if( unidadeSelecionada == 'centimetros'){
          document.querySelector('#unidade').innerText = '(cm)';
        } else {
          document.querySelector('#unidade').innerText = '(m)';
        }
        if(inputAltura.value){
          alteraUnidade(inputAltura, unidadeSelecionada)
        }
      }
    })
  })

  // Adiciona o evento 'keyup' nos campos de altura e peso, 
  // pois a validação ocorre no momento em que o usuário estiver digitando
  inputAltura.addEventListener('keyup', function(){
    validaAltura(inputAltura);
  })
  inputPeso.addEventListener('keyup', function(){
    validaPeso(inputPeso);
  })

  // Adiciona o evento de clique no botão, limpa o resultado e chama a função que irá
  // tratar os dados antes de calcular o IMC
  button.addEventListener('click', function(evento){
    // Apliquei este método para que os valores não saiam da tela quando o botão de calcular for acionado
    evento.preventDefault();
    limpaResultado();
    tratamentoDados(unidadeSelecionada, inputAltura, inputPeso);
  })

  //Execução dos testes
  executaTestes()
}

// Calcula a unidade selecionada
function alteraUnidade(inputAltura, unidade){
  let altura = inputAltura.value.trim();

  if(altura.includes(',')){
    altura = altura.replace(',','.');
  }
  altura = parseFloat(altura);

 if(unidade == 'centimetros'){
  let unidadeCentimetros = (altura * 100).toString();
  inputAltura.value = unidadeCentimetros;
  
 } else {
  let unidadeMetros = (altura / 100).toString();
  inputAltura.value = unidadeMetros;
 }
}

// Função de testes
function executaTestes(){
  const valoresTeste = [
    [1.70, 80.5],
    [1.50, 45],
    [1.97, 70],
    [1,40, 65.32],
    [1.64, 96.88],
    [2.06, 43.44]
  ]

  valoresTeste.forEach((teste)=>{
    calculoIMC(teste[0], teste[1], true)
  })
}

// Função responsável por validar os valores do campo altura quando ocorrer a digitação,
// quando o campo altura estiver incorreto, a unidade não pode ser alterada.
function validaAltura(altura){
  let radio = document.querySelectorAll('.radio');

  if(altura.value){
    if(regexFormatoNumeros.test(altura.value.trim()) && parseFloat(altura.value) > 0){

      if(altura.classList.contains('invalido')){
        altura.classList.remove('invalido');
        altura.nextElementSibling.innerText = '';
        radio.forEach(item=>{
          item.querySelector('input').disabled = false;
        })
      }
    } else {
      altura.classList.add('invalido');
      radio.forEach(item=>{
        item.querySelector('input').disabled = true;
      })
      altura.nextElementSibling.innerText = 'Informe valores válidos';
    
    }
  } else {
    if(altura.classList.contains('invalido')){
      altura.classList.remove('invalido');
      altura.nextElementSibling.innerText = '';
    }
  }
}

// Função responsável por validar os valores do campo peso quando ocorrer a digitação
function validaPeso(peso){
  if(peso.value){
    if(regexFormatoNumeros.test(peso.value.trim()) && parseFloat(peso.value) > 0){

      if(peso.classList.contains('invalido')){
        peso.classList.remove('invalido');
        peso.nextElementSibling.innerText = '';
      }

    } else {
      peso.classList.add('invalido');
      peso.nextElementSibling.innerText = 'Informe valores válidos';
    
    }
  } else {
    if(peso.classList.contains('invalido')){
      peso.classList.remove('invalido');
      peso.nextElementSibling.innerText = '';
    }
  }
}

// Verifica se não há erros nos campos de altura e peso, e se não estão vazios,
// ele é acionado quando o botão de calcular for ativado. 
function validaCampos(altura, peso){
 
  let alturaValida = false;
  let pesoValido = false;

  if(!altura.classList.contains('invalido')){
    if(altura.checkValidity()){
      alturaValida = true;
  
    } else {
      altura.classList.add('invalido');
      altura.nextElementSibling.innerText = altura.validationMessage;
    }
  }

  if(!peso.classList.contains('invalido')){
    if(peso.checkValidity()){
      pesoValido = true;
    } else {
      peso.classList.add('invalido');
      peso.nextElementSibling.innerText = peso.validationMessage;
    }
  }
  return pesoValido && alturaValida;
}

// Realiza o calculo do IMC
function calculoIMC(altura, peso, teste){
  const displayClassificacao = document.querySelector('#classificacao');
  const displayValorIMC = document.querySelector('#valorIMC');

  let imc = (peso / (altura * altura)).toFixed(1);
  let classificacao = '';

  if(imc < 18.5){
    classificacao = 'Abaixo do peso';
  } else if (imc >= 18.5 && imc < 24.9){
    classificacao = 'Peso normal';
  } else if (imc >= 25 && imc < 29.9) {
    classificacao = 'Sobrepeso';
  } else {
    classificacao = 'Obesidade';
  }
  if(!teste){
    displayValorIMC.innerText = imc;
    displayClassificacao.innerText = classificacao;
  } else {
    console.log(`Altura: ${altura}, peso: ${peso} -> classificação: ${classificacao}, IMC: ${imc}`)
  }
}

// Aplica os valores --/-- no local de resultado
function limpaResultado(){
  document.querySelector('#classificacao').innerText='--/--';
  document.querySelector('#valorIMC').innerText='--/--';
}

// Realiza a conversão dos dados para números (float), chama a função validaCampos
// e executa a função cálculo IMC. Caso a unidade da altura veio em centimetros, este valor será
// transformado para metros antes do cálculo.
function tratamentoDados(unidade, altura, peso){  
  let valido = validaCampos(altura, peso);

  if(valido){
    altura = altura.value.trim();
    peso = peso.value.trim();

    if(altura.includes(',')){
      altura = altura.replace(',','.');
    }

    if(peso.includes(',')){
      peso = peso.replace(',','.');
    }

    altura = parseFloat(altura);
    peso = parseFloat(peso);

    if(unidade == 'centimetros'){
      altura = altura / 100;
    }
    calculoIMC(altura, peso, false)
  } 
}





