document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.nav-toggle').addEventListener('click', function() {
        document.getElementById('main-nav').classList.toggle('active');
    });
});

function copyCode(button) {
    const codeBlock = button.parentElement;
    const code = codeBlock.querySelector('code').textContent;

    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';

        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

// Sistema de Quiz
function initQuiz() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {
            const question = this.closest('.quiz-question');
            question.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
        });
    });
}

function checkQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    const answers = {
        1: 'A',
        2: 'B',
        3: 'WHERE idade = 21',
        4: 'C',
        5: 'ORDER BY nome ASC',
        6: 'C',
        7: 'SELECT COUNT(*)',
        8: 'B'
    };

    const explanations = {
        1: 'O comando correto para inserir dados é INSERT INTO. Os outros não são comandos SQL válidos.',
        2: 'A consulta retorna apenas os nomes dos alunos com idade maior que 20 anos.',
        3: 'A cláusula WHERE é usada para filtrar registros com base em condições específicas.',
        4: 'O comando UPDATE é usado para modificar registros existentes em uma tabela.',
        5: 'ORDER BY é usado para ordenar resultados, e ASC especifica ordem ascendente (alfabética).',
        6: 'Se você executar DELETE sem WHERE, todos os registros da tabela serão excluídos.',
        7: 'COUNT(*) conta o número de registros na tabela.',
        8: 'LEFT JOIN retorna todos os registros da tabela à esquerda, mesmo sem correspondência na direita.'
    };

    questions.forEach(question => {
        const questionNum = question.getAttribute('data-question');
        const feedback = question.querySelector('.quiz-feedback');

        if (questionNum == 3 || questionNum == 5 || questionNum == 7) {
            const fillElement = document.getElementById(`fill-${questionNum}`);
            const userAnswer = fillElement.textContent.trim().toUpperCase();
            const correctAnswer = answers[questionNum].toUpperCase();
            const isCorrect = userAnswer === correctAnswer;

            if (isCorrect) {
                correctAnswers++;
                feedback.textContent = 'Correto! ' + explanations[questionNum];
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');
                fillElement.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
            } else {
                feedback.textContent = 'Incorreto. ' + explanations[questionNum];
                feedback.classList.remove('correct');
                feedback.classList.add('incorrect');
                fillElement.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
            }
        } else {
            const selectedOption = question.querySelector('.quiz-option.selected');

            if (!selectedOption) {
                feedback.textContent = 'Por favor, selecione uma resposta.';
                feedback.classList.add('incorrect');
                feedback.style.display = 'block';
                return;
            }

            const selectedValue = selectedOption.getAttribute('data-value');
            const isCorrect = selectedValue === answers[questionNum];

            if (isCorrect) {
                correctAnswers++;
                feedback.textContent = 'Correto! ' + explanations[questionNum];
                feedback.classList.remove('incorrect');
                feedback.classList.add('correct');
                selectedOption.classList.add('correct');
            } else {
                feedback.textContent = 'Incorreto. ' + explanations[questionNum];
                feedback.classList.remove('correct');
                feedback.classList.add('incorrect');
                selectedOption.classList.add('incorrect');

                question.querySelectorAll('.quiz-option').forEach(opt => {
                    if (opt.getAttribute('data-value') === answers[questionNum]) {
                        opt.classList.add('correct');
                    }
                });
            }
        }

        feedback.style.display = 'block';
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    document.getElementById('quiz-score').textContent = `Você acertou ${correctAnswers} de ${totalQuestions} questões (${score}%).`;
    document.getElementById('quiz-progress').style.width = `${score}%`;

    let reviewText = '<h3>Recomendações de Estudo:</h3><ul>';

    if (correctAnswers === totalQuestions) {
        reviewText += '<li>Parabéns! Você demonstrou um bom domínio dos conceitos básicos de SQL.</li>';
    } else {
        if (correctAnswers < 4) {
            reviewText += '<li>Reveja os conceitos básicos de SQL, especialmente os comandos fundamentais.</li>';
        } else if (correctAnswers < 7) {
            reviewText += '<li>Você tem um bom conhecimento básico, mas precisa praticar mais.</li>';
        } else {
            reviewText += '<li>Seu conhecimento é sólido, mas ainda há espaço para aperfeiçoamento.</li>';
        }

        reviewText += '<li>Consulte a seção "SQL Básico" para revisar os conceitos.</li>';
        reviewText += '<li>Revise a página sobre JOINS para entender melhor como combinar tabelas.</li>';
    }

    reviewText += '</ul>';

    document.getElementById('quiz-review').innerHTML = reviewText;
    document.getElementById('quiz-results').classList.remove('hidden');

    document.getElementById('quiz-results').scrollIntoView({ behavior: 'smooth' });
}

function resetQuiz() {
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    document.querySelectorAll('.quiz-feedback').forEach(feedback => {
        feedback.style.display = 'none';
        feedback.classList.remove('correct', 'incorrect');
    });

    document.querySelectorAll('.fill-in-blank').forEach(fill => {
        fill.textContent = '';
        fill.style.backgroundColor = '';
    });

    document.getElementById('quiz-results').classList.add('hidden');

    document.getElementById('exercicios').scrollIntoView({ behavior: 'smooth' });
}

// Animações para JOINS
function startJoinDemo(type) {
    const demo = document.getElementById(`${type}-join-demo`);
    demo.setAttribute('data-step', '0');
    demo.querySelector('.result-vis').classList.remove('hidden');
    nextStep(type);
}

function nextStep(type) {
    const demo = document.getElementById(`${type}-join-demo`);
    let step = parseInt(demo.getAttribute('data-step') || 0);
    const resultVis = demo.querySelector('.result-vis');

    // Limpar highlights anteriores
    demo.querySelectorAll('.highlight').forEach(el => {
        el.classList.remove('highlight');
    });

    step++;

    if (type === 'inner') {
        if (step === 1) {
            // Destacar a primeira linha da tabela Alunos (Ana, curso_id=1)
            demo.querySelector('.table-row[data-id="1"]').classList.add('highlight');
        } else if (step === 2) {
            // Destacar a linha correspondente na tabela Cursos (Engenharia, id=1)
            demo.querySelectorAll('.table-row[data-id="1"]').forEach(row => {
                if (row.closest('.table-vis').querySelector('h4').textContent === 'Cursos') {
                    row.classList.add('highlight');
                }
            });
        } else if (step === 3) {
            // Adicionar ao resultado
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">Ana</div>
                        <div class="table-cell">Engenharia</div>
                    `;
            resultVis.appendChild(resultRow);
        } else if (step === 4) {
            // Destacar a segunda linha da tabela Alunos (João, curso_id=2)
            demo.querySelector('.table-row[data-id="2"]').classList.add('highlight');
        } else if (step === 5) {
            // Destacar a linha correspondente na tabela Cursos (Medicina, id=2)
            demo.querySelectorAll('.table-row[data-id="2"]').forEach(row => {
                if (row.closest('.table-vis').querySelector('h4').textContent === 'Cursos') {
                    row.classList.add('highlight');
                }
            });
        } else if (step === 6) {
            // Adicionar ao resultado
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">João</div>
                        <div class="table-cell">Medicina</div>
                    `;
            resultVis.appendChild(resultRow);
        } else if (step === 7) {
            // Destacar a terceira linha da tabela Alunos (Maria, curso_id=1)
            demo.querySelector('.table-row[data-id="3"]').classList.add('highlight');
        } else if (step === 8) {
            // Destacar a linha correspondente na tabela Cursos (Engenharia, id=1)
            demo.querySelectorAll('.table-row[data-id="1"]').forEach(row => {
                if (row.closest('.table-vis').querySelector('h4').textContent === 'Cursos') {
                    row.classList.add('highlight');
                }
            });
        } else if (step === 9) {
            // Adicionar ao resultado
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">Maria</div>
                        <div class="table-cell">Engenharia</div>
                    `;
            resultVis.appendChild(resultRow);
        } else {
            // Fim da demonstração
            return;
        }
    } else if (type === 'left') {
        if (step === 1) {
            // Destacar a primeira linha da tabela Alunos (Ana, curso_id=1)
            demo.querySelector('.table-row[data-id="1"]').classList.add('highlight');
        } else if (step === 2) {
            // Destacar a linha correspondente na tabela Cursos (Engenharia, id=1)
            demo.querySelectorAll('.table-row[data-id="1"]').forEach(row => {
                if (row.closest('.table-vis').querySelector('h4').textContent === 'Cursos') {
                    row.classList.add('highlight');
                }
            });
        } else if (step === 3) {
            // Adicionar ao resultado
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">Ana</div>
                        <div class="table-cell">Engenharia</div>
                    `;
            resultVis.appendChild(resultRow);
        } else if (step === 4) {
            // Destacar a quarta linha da tabela Alunos (Pedro, curso_id=4)
            demo.querySelector('.table-row[data-id="4"]').classList.add('highlight');
        } else if (step === 5) {
            // Não há correspondência para Pedro (curso_id=4)
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">Pedro</div>
                        <div class="table-cell">NULL</div>
                    `;
            resultVis.appendChild(resultRow);
        } else {
            // Fim da demonstração
            return;
        }
    } else if (type === 'right') {
        if (step === 1) {
            // Destacar a quarta linha da tabela Cursos (Administração, id=4)
            demo.querySelectorAll('.table-row[data-id="4"]').forEach(row => {
                if (row.closest('.table-vis').querySelector('h4').textContent === 'Cursos') {
                    row.classList.add('highlight');
                }
            });
        } else if (step === 2) {
            // Não há correspondência para Administração (id=4)
            const resultRow = document.createElement('div');
            resultRow.className = 'table-row highlight';
            resultRow.innerHTML = `
                        <div class="table-cell">NULL</div>
                        <div class="table-cell">Administração</div>
                    `;
            resultVis.appendChild(resultRow);
        } else {
            // Fim da demonstração
            return;
        }
    }

    demo.setAttribute('data-step', step);
}

function resetDemo(type) {
    const demo = document.getElementById(`${type}-join-demo`);
    demo.removeAttribute('data-step');
    demo.querySelector('.result-vis').classList.add('hidden');
    demo.querySelectorAll('.result-vis .table-row:not(:first-child)').forEach(row => row.remove());
    demo.querySelectorAll('.highlight').forEach(el => {
        el.classList.remove('highlight');
    });
}
