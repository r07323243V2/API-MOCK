pipeline {
  agent any

  stages {
    stage ('inicial') {
      steps {
        step {
          echo 'Ola eu sou o FV, vou te servir nesse momento.'
        }
        step {
          echo 'Irei iniciar o processo da pipeline, isso pode demorar alguns minutos, te encontro no fim...'
        }
      }
    }
    stage ('Build Image') {
      steps {
        step {
          echo 'Iniciando build da imagem.'
        }
      }
    }
  }

}
