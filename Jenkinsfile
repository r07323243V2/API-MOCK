pipeline {
  agent any

  stages {
    stage ('inicial') {
      steps {
        echo 'Ola eu sou o FV, vou te servir nesse momento.'
        echo 'Irei iniciar o processo da pipeline, isso pode demorar alguns minutos, te encontro no fim...'
      }
    }
    stage ('Node Commands') {
      steps {
        echo 'Executando comandos node...'
        script {
          if (fileExists('library/Request.js')) {
            echo "File library/Request.js found!"
          } else {
            echo "File library/Request.js not found!"
          }
        }
      }
    }
    stage ('Git Commands') {
      steps {
        echo 'Executando comandos git...'
        script {
          sh 'git log --pretty=oneline -30 --first-parent --graph'
        }
      }
    }
  }

}
