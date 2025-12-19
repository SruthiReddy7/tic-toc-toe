const boxes = document.querySelectorAll('.box');
const restartbtn = document.getElementById('restart');
const msgContainer = document.querySelector('.msg-container');
const msg = document.getElementById('msg');
const xScoreDisplay = document.getElementById('xScore');
const oScoreDisplay = document.getElementById('oScore');

let playerO = true;
let xScore = 0;
let oScore = 0;

const wins = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

const restart = () => {
    playerO = true;
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    msgContainer.classList.add('hide');
};

const showWinner = async (winner) => {
    msg.innerText = `🎉 Player ${winner} Wins!`;
    msgContainer.classList.remove('hide');
    boxes.forEach(box => box.disabled = true);

    await new Promise(resolve => setTimeout(resolve, 500));

    if (winner === 'X') {
        xScore++;
        xScoreDisplay.innerText = xScore;
    } else if (winner === 'O') {
        oScore++;
        oScoreDisplay.innerText = oScore;
    }
};

const checkWinner = async () => {
    for (let pattern of wins) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if (pos1 && pos1 === pos2 && pos2 === pos3) {
            await showWinner(pos1);
            return true;
        }
    }

    const allFilled = [...boxes].every(box => box.innerText !== "");
    if (allFilled) {
        msg.innerText = "It's a Draw!";
        msgContainer.classList.remove('hide');
        return true;
    }

    return false;
};

const waitForPlayerMove = () => {
    return new Promise(resolve => {
        boxes.forEach(box => {
            box.onclick = () => {
                if (!box.innerText) {
                    if (playerO) {
                        box.innerText = "O";
                        box.style.color = "#bc4749";
                    } else {
                        box.innerText = "X";
                        box.style.color = "#343a40";
                    }
                    box.disabled = true;
                    playerO = !playerO;
                    resolve(); 
                }
            };
        });
    });
};

const startGame = async () => {
    while (true) {
        await waitForPlayerMove();     
        const isGameOver = await checkWinner(); 
        if (isGameOver) break;         
    }
};

startGame();

restartbtn.addEventListener('click', async () => {
    restart();
    await startGame();
});
