const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const questionListDiv = document.getElementById('questionList');
const questionCategorySelect = document.getElementById('questionCategory');
const notificationDiv = document.getElementById('notification');

// 상태 변수: 질문 처리 중 여부
let isProcessingQuestion = false;

// 알림 표시 함수
function showNotification(message, duration = 3000) {
    notificationDiv.textContent = message;
    notificationDiv.style.display = 'block';

    setTimeout(() => {
        notificationDiv.style.display = 'none';
    }, duration);
}
function handleEnterKey(event) {
    if (event.key === "Enter") { // 엔터키인지 확인
        sendMessage(); // 버튼 동작 실행
    }
}
// 초기 안내 메시지 처리
function showPlaceholder() {
    const placeholder = document.getElementById('placeholder');
    if (messagesDiv.children.length === 0 && placeholder) {
        placeholder.style.display = 'flex';
    } else if (placeholder) {
        placeholder.style.display = 'none';
    }
}

// 메시지 추가
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

// 질문 클릭 이벤트
function handleQuestionClick(question) {
    if (isProcessingQuestion) {
        showNotification('현재 질문에 대한 응답이 처리 중입니다. 잠시만 기다려주세요.');
        return;
    }

    isProcessingQuestion = true; // 질문 처리 시작
    typeToInputAndSend(question);
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

// 메시지 전송
function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';

    setTimeout(() => {
        const response = getAIResponse(message);
        addMessage(response, 'ai', true); // HTML 메시지 처리
        isProcessingQuestion = false; // 질문 처리 완료
        showPlaceholder(); // 필요 시 초기 메시지 표시
    }, 500);
}

// AI 응답
function getAIResponse(message) {
    const responses = {
        '안녕하세요.': 'DX 뉴스레터 챗봇입니다. 좌측에서 질문 카테고리와 질문을 선택해보세요!',
        '챗봇은 많이 들어봤지만, 정확히 어떤 서비스 인가요?': '<p>챗봇은 <b>문자나 음성을 통해 사용자와 소통하는 AI 도구</b>입니다. 자연어 처리(NLP) 기술을 활용해 사용자의 질문을 이해하고 적절한 답변을 제공합니다. 언제 어디서나 문제를 해결하고, 정보를 제공하며, 다양한 작업을 도와줄 수 있습니다.</p><br/>이러한 점을 바탕으로 AI 정비 챗봇을 개발하게 되었으며, <b>현재 도요타 모델인 7FB와 7FBR의 매뉴얼을 학습</b>하고 있습니다. 표준화된 용어사전을 기반으로 일관된 답변을 제공할 수 있도록 준비 중입니다.',
        '그렇다면 AI 정비 챗봇이란 무엇인가요?': 'AJ의 AI 정비 챗봇은 <b>정비 매뉴얼을 디지털화</b>하고 <b>문제를 해결을 지원</b>하는 전문 가상 도우미입니다.',
        '기존 정비 시스템과 AI 정비 챗봇의 차이점은 무엇인가요?': '기존 시스템은 사람이 직접 매뉴얼을 검색하고 데이터를 관리해야 해서 시간이 많이 소요되었지만, AI 정비 챗봇은 이 과정을 <b>자동화</b>하여 <b>정비 시간을 크게 줄여줍니다.</b>',
        'AI 정비 챗봇은 어떤 기술로 작동하나요?': '<b>자연어 처리(NLP)</b>와 <b>기계 학습(ML)</b>을 통해 사용자의 질문을 이해하고 답변을 제공합니다.<br/>기본적으로 글(text)로 질문하고 글(text)로 답변하지만, <b>현장 상황</b>과 <b>정비사의 니즈</b>를 반영하여 질문 양식을 미리 만들어 놓거나 몇 번의 클릭만으로 질문을 완성할 수 있도록 <b>편의성을 높일 예정</b>입니다.',
        '초보 정비사도 AI 정비 챗봇을 사용할 수 있나요?': '<p>네, 간단한 인터페이스 덕분에 <b>초보자도 쉽게 사용</b>할 수 있습니다.</p><br/> AI 정비 챗봇은 궁금한 내용에 대하여 컴퓨터가 정확하게 인지할 수 있도록 질문을 해야합니다. 따라서 궁금한 장비의 모델이나 에러코드 등을 특정하여 질문한다면 초보자도 쉽게 사용하실 수 있습니다. 구축 단계에서 편리하고 정확한 질문을 할 수 있도록 <b>질문 양식을 규격화하여 편의 기능으로 제공 예정</b>입니다.',
        'AI 정비 챗봇은 데이터를 어떻게 업데이트하나요?': '<p><b>클라우드 기반으로 실시간 업데이트</b>가 이루어져 최신 데이터를 유지합니다.</p><br/> 제조사에게 제공되는 매뉴얼이나 부품 카탈로그는 AI가 확인할 수 있는 데이터로 변환하는 작업을 자동으로 진행합니다. 이를 전처리라고 합니다. 뛰어난 저희 엔지니어분들의 노하우 역시 AI가 활용할 수 있도록 <b>정비 일지, 교육 자료 등을 전처리하여 저장한 후 활용할 예정</b>입니다. AI는 질문에 대해 정답에 가장 근접한 답변을 회신하며, 사용자의 평가를 근거로 정확도를 높여 나갑니다.',
        'AI 정비 챗봇이 정비사의 역할을 대체할 수 있나요?': '아니요, AI는 엔지니어를 <b>보조하는 도구</b>로 설계되었습니다.<br/>엔지니어의 <b>비서 역할</b>로 활약이 기대됩니다. 귀찮게 생각되었던 매뉴얼을 찾아보고 부품번호가 나와있는 카탈로그의 페이지를 찾는 행위를 도와주는 역할입니다.',
        '산업장비 정비파트에서 AI 정비 챗봇이 필요한 이유는 뭔가요?': '<p><b>정확하고 빠른 정보 검색</b>과 외부 AI 플랫폼의 <b>보안 이슈</b>로 인해 자체 AI 정비 챗봇이 필요하다고 판단했습니다.</p><br/><p>지난해 효과성을 사전 검증하기 위해 산업장비 운영본부와 정비 방식에 대한 비즈니스 현안을 확인했습니다. 정비 매뉴얼과 부품 카탈로그를 공유 폴더를 활용하여 검색하고 있었지만, 영문 문서는 가독성이 떨어지고 부품 카탈로그는 원하는 페이지를 찾는 데 어려움이 있었습니다. 400여 개 모델의 문서를 찾아가는 불편함도 있었습니다. AI 정비 챗봇을 통해 질의응답 방식으로 빠르고 정확하게 정보를 찾을 수 있을 것으로 기대하고 있습니다.</p><br/><p>또한 외부 AI 플랫폼으로 업무와 연관된 데이터를 학습시키면 보안상 위험이 있을 수 있어 AJ만의 자체 AI 정비 챗봇을 설계하였습니다.</p>',
        '정비파트에 AI 서비스가 도입되면 영업사원 입장에서 어떤 점이 좋아지나요?': '<b>빠른 AS 처리</b>는 AJ의 핵심 역량 중 하나입니다. AS 출동 전 정확한 부품을 미리 준비하고 현장에서 고장 점검 시간을 줄이면서 정확도를 높인다면 <b>고객 만족도</b>가 높아질 것으로 기대합니다.',
        'AI 정비 챗봇은 어떻게 접속하나요? 모바일로도 가능한가요?' : '현재는 <b>PC 웹</b>에서 사용 가능합니다. 향후 기능 개선을 통해 현장에서 모바일로도 사용할 수 있도록 제공될 예정입니다.',
        '언제부터 AI 정비 챗봇을 사용할 수 있나요?': `
        <div>
            <b>[1차 오픈] 도요타 (7FB, 7FBR)</b> : 매뉴얼 디지털화 및 데이터 정제 작업 시작<br/>
            <b>[2차 오픈] 도요타 (8FB, 8FBR)</b> : 추가 모델 매뉴얼 디지털화<br/>
            <b>[3차 오픈] 클라크 (EPX, CRX)</b> : 클라크 모델 매뉴얼 디지털화 및 테스트<br/>
            <b>[4차 오픈] 현대 (30D-9, 30D-9H)</b> : 현대 주요 모델 매뉴얼 디지털화<br/>
            <b>[5차 오픈] 두산 (D30S-7, D30SE-7, D30SE-9)</b> : 두산 모델 매뉴얼 디지털화 및 최종 통합<br/>
        </div><br/>
        프로젝트는 총 5단계로 구성되어 있으며, 도요타 7FB와 7FBR 모델은 3월 내 1차 오픈 후 바로 사용이 가능할 예정입니다. 2차는 도요타 8FB와 8FBR 모델로 4월 중 오픈될 예정이며, 3차인 클라크는 6월, 4차인 현대는 7월, 두산은 9월에 오픈될 예정입니다.`,
        'AI 정비 챗봇은 어떻게 사용하나요? 예시를 들어주실 수 있나요?': `
            <div>
                <p>인터넷이 연결된 기기에서 간단히 접속할 수 있으며, <b>모델명과 증상만 입력</b>하면 됩니다. 아래는 POC에서 구현된 실제 작동 예시 입니다.</p>
                <h3>예시</h3>
                <p>Q. Toyota 7FBR10_18 포크리프트의 Error Code A4 관련 정보 알려줘</p>
                <h4>A.안녕하세요. Toyota 7FBR10_18 포크리프트의 Error Code A4 관련 정보를 알려드리겠습니다.</h4>
                <div class="error-section">
                    <h1>Error Code A4 (악셀레이터 스위치 이상)</h1>

                    <div class="related-parts">
                        <h2>관련 부품</h2>
                        <ul>
                        <li>CPU 보드
                            <ul>
                            <li>CN101-1(4S, DSF) 연결</li>
                            <li>CN101-2(4S, DSR) 연결</li>
                            <li>CN101-12(1S, LS-) 연결</li>
                            </ul>
                        </li>
                        <li>CN26 커넥터
                            <ul>
                            <li>CN101-1(4S, DSF) ↔ CN26의 2번 핀</li>
                            <li>CN101-2(4S, DSR) ↔ CN26의 4번 핀</li>
                            <li>CN101-12(1S, LS-) ↔ CN26의 1번 핀</li>
                            </ul>
                        </li>
                        </ul>
                    </div>

                    <div class="error-check">
                        <h2>오류 점검 조건</h2>
                        <ol>
                        <li>배터리 클램프 연결 시 악셀레이터 페달 ON 신호가 출력되면 해결됨
                            <ul>
                            <li>비정상: CN26 분리</li>
                            <li>정상: 정상 작동</li>
                            </ul>
                        </li>
                        <li>배터리 클램프 분리 시
                            <ul>
                            <li>정상 작동</li>
                            </ul>
                        </li>
                        <li>A4 오류가 표시되지 않는지 확인
                            <ul>
                            <li>비정상: 악셀레이터 스위치 조정</li>
                            <li>정상: CN101 분리 후 CN101-1, CN101-2의 단락 확인</li>
                            </ul>
                        </li>
                        </ol>
                    </div>

                    <div class="component-info">
                        <h2>결함 원인 별 관련 부품 정보</h2>
                        <p><strong>Error Code:</strong> A4</p>
                        <p><strong>Error Name:</strong> 악셀레이터 스위치 이상</p>
                        <table>
                            <thead>
                                <tr>
                                <th>관련부품명</th>
                                <th>부품코드</th>
                                <th>결함원인</th>
                                <th>상세부품명</th>
                                <th>상세부품코드</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>PANEL ASSY, DRIVE CONTROL</td>
                                <td>2401</td>
                                <td>CPU결함</td>
                                <td>PANEL ASSY, DRIVE CONTROL</td>
                                <td>2401-01</td>
                                </tr>
                                <tr>
                                <td>ACCELERATOR ASSY</td>
                                <td>2611</td>
                                <td>악셀레이터 스위치 조정</td>
                                <td>ACCELERATOR ASSY</td>
                                <td>2611-01</td>
                                </tr>
                                <tr>
                                <td>HARNESS ASSY,WIRING</td>
                                <td>5602</td>
                                <td>단락 수리</td>
                                <td>HARNESS ASSY,WIRING</td>
                                <td>5602-10</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
            </div>
        `
    };

    return responses[message] || "질문에 대한 답변을 준비 중입니다.";
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

// 초기 메시지 추가
function initializeChat() {
    addMessage('안녕하세요.', 'user');
    setTimeout(() => {
        addMessage('DX 뉴스레터 챗봇입니다. 좌측에서 질문 카테고리와 질문을 선택해보세요!', 'ai');
    }, 500);
}

// 초기화
updateQuestions();
showPlaceholder();
initializeChat();
