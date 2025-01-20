const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const questionListDiv = document.getElementById('questionList');
const questionCategorySelect = document.getElementById('questionCategory');

// 초기 안내 메시지 처리
function showPlaceholder() {
    const placeholder = document.getElementById('placeholder');
    if (messagesDiv.children.length === 0 && placeholder) {
        placeholder.style.display = 'flex';
    } else if (placeholder) {
        placeholder.style.display = 'none';
    }
}

function addMessage(content, sender, isHTML = false) {
    const placeholder = document.getElementById('placeholder');

    // 초기 안내 메시지 숨기기
    if (placeholder) {
        placeholder.style.display = 'none';
    }

    // 메시지 추가
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add('bubble');

    if (isHTML) {
        bubbleDiv.innerHTML = content; // HTML 메시지 처리
    } else {
        bubbleDiv.textContent = content; // 일반 텍스트
    }

    messageDiv.appendChild(bubbleDiv);
    messagesDiv.appendChild(messageDiv);

    // 메시지 영역 표시
    messagesDiv.style.display = 'block';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// 질문 데이터
const questionData = {
    operational1: [
        '챗봇은 많이 들어봤지만, 정확히 어떤 서비스 인가요?',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?',
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?'
    ],
    operational2: [
        '산업장비 정비파트에서 AI 정비 챗봇이 필요한 이유는 뭔가요?',
        '정비파트에 AI 서비스가 도입되면 영업사원 입장에서 어떤 점이 좋아지나요?'
    ],
    operational3: [
        '언제부터 AI 정비 챗봇을 사용할 수 있나요?',
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?',
        'AI 정비 챗봇은 어떻게 접속하나요? 모바일로도 가능한가요?'
    ]
};

// 질문 목록 업데이트
function updateQuestions() {
    const selectedCategory = questionCategorySelect.value;
    const questions = questionData[selectedCategory] || [];
    questionListDiv.innerHTML = '';

    questions.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.textContent = `Q${index + 1}. ${question}`;
        questionDiv.onclick = () => handleQuestionClick(question);
        questionListDiv.appendChild(questionDiv);
    });
}

// 입력된 질문 자동 전송
function typeToInputAndSend(text) {
    userInput.value = '';
    let index = 0;
    const interval = setInterval(() => {
        userInput.value += text[index];
        index++;
        if (index >= text.length) {
            clearInterval(interval);
            sendMessage(); // 자동으로 전송
        }
    }, 50);
}

// 질문 클릭 이벤트
function handleQuestionClick(question) {
    typeToInputAndSend(question);
}

// 메시지 전송
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'ai', true); // HTML 메시지 처리
        showPlaceholder(); // 필요 시 초기 메시지 표시
    }, 500);
}

// AI 응답
function getAIResponse(message) {
    const responses = {
        '챗봇은 많이 들어봤지만, 정확히 어떤 서비스 인가요?': '챗봇은 문자나 음성을 통해 사용자와 소통하는 AI 도구입니다. 자연어 처리(NLP) 기술을 활용해 사용자의 질문을 이해하고 적절한 답변을 제공합니다. 언제 어디서나 문제를 해결하고, 정보를 제공하며, 다양한 작업을 도와줄 수 있습니다.',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?': 'AJ의 AI 정비 챗봇은 정비 매뉴얼을 디지털화하고 문제를 해결을 지원하는 전문 가상 도우미입니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?': '기존 시스템은 사람이 직접 매뉴얼을 검색하고 데이터를 관리해야 해서 시간이 많이 소요되었지만, AI 정비 챗봇은 이 과정을 자동화하여 정비 시간을 크게 줄여줍니다.',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?': '자연어 처리(NLP)와 기계 학습(ML)을 통해 사용자의 질문을 이해하고 답변을 제공합니다.',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?': '네, 간단한 인터페이스 덕분에 초보자도 쉽게 사용할 수 있습니다.',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?': '클라우드 기반으로 실시간 업데이트가 이루어져 최신 데이터를 유지합니다.',
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?': '아니요, AI는 정비사를 보조하는 도구로 설계되었습니다.',
        '산업장비 정비파트에서 AI 정비 챗봇이 필요한 이유는 뭔가요?': '정확하고 빠른 정보 검색과 외부 AI 플랫폼의 보안 이슈로 인해 자체 AI 정비 챗봇이 필요하다고 판단했습니다.',
        '정비파트에 AI 서비스가 도입되면 영업사원 입장에서 어떤 점이 좋아지나요?': '빠른 AS 처리는 AJ의 핵심 역량 중 하나입니다. 고객 만족도를 높일 수 있습니다.',
        '언제부터 AI 정비 챗봇을 사용할 수 있나요?': '프로젝트는 총 5단계로 구성되어 있으며, 각 단계별 오픈 일정이 예정되어 있습니다.',
        '이주연 과장님!' : '저 괴롭히지 마요',
        '최광해' : '최! 광! 해! 아이 할때 해! 해해해해해해해해해해해해해해해해해해해해해해해해',
        '엄태승' : '1. 제가 할게 좀 남아서 \n 2. 현업 문의건 처리하고 가겠습니다!',
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?': `
            <div>
                <p>AI 정비 챗봇은 간단히 접속하여 모델명과 증상을 입력하면 됩니다.</p>
                <h3>예시</h3>
                <p>입력: 도요타, 7FBR, 에러코드 A4</p>
                <h4>결과</h4>
                <table border="1" style="border-collapse: collapse; width: 100%;">
                    <tr>
                        <th>항목</th>
                        <th>내용</th>
                    </tr>
                    <tr>
                        <td>증상</td>
                        <td>악셀레이터 스위치 이상</td>
                    </tr>
                    <tr>
                        <td>조치</td>
                        <td>스위치 교체</td>
                    </tr>
                </table>
                <img src="img/ai-image.png" alt="AI 응답 예시" style="width: 100%; height:500px; margin-top: 10px;">
            </div>
        `
    };

    return responses[message] || "질문에 대한 답변을 준비 중입니다.";
}

// 초기화
updateQuestions();
showPlaceholder();
