/* 질문 받기 연습실 영어판 — 1단계(첫 화면 · 질문 고르기 · 이용 안내)
   주소 끝에 ?lang=en 을 붙일 때만 켜집니다. 한국어 화면에는 아무 영향이 없어요.
   방식: 화면이 그려질 때마다 한국어 글 조각을 아래 사전(UI)과 규칙(RE)으로 바꿉니다.
   번역 원칙(다음 단계도 같게):
   - 아이 이름은 로마자 한국 이름(민준→Minjun), 학년은 미국식(중2→8th grade, 고1→10th grade).
   - 대답 갈래: 여는 대답 = opening answer, 아쉬운 대답 = near-miss answer, 닫는 대답 = closing answer.
   - 한국 긴급·상담 전화번호(112·109·1388·1366·1577-0199)는 영어판에 쓰지 않고 '사는 곳의 번호'로 안내.
   - 성경 구절은 풀어 쓰기.
   아직 번역하지 않은 화면(장면 본문, AI 대화, 자료 길잡이 등)은 한국어로 남습니다. */
(function () {
  var on = /(?:^|[?&])lang=en(?:&|$)/.test(location.search);
  window.QP_LANG = on ? "en" : "ko";
  if (!on) return;

  var UI = {
    /* 머리·방 고르기·바닥글 */
    "질문 받기 연습실": "Question Practice Room",
    "글자 크게": "Larger text",
    "글자 보통": "Normal text",
    "연습하기": "Practice",
    "함께 느끼기": "Experience Together",
    "새 방": "New room",
    "방 고르기": "Choose a room",
    "← 처음으로": "← Home",
    "3분 신학 도서관 · 체험판 · 감수 전입니다. 쓰신 대답과 대화는 이 사이트에 저장되지 않으며, 화면을 닫으면 사라집니다. AI 기능을 쓰면 답을 만들기 위해 쓰신 글이 Claude(Anthropic의 AI)로 보내지며, 이 사이트는 그 글을 저장하지 않습니다. 아이를 알아볼 수 있는 정보(이름, 학교 등)는 넣지 마세요.": "3-Minute Theology Library · Trial version · Not yet reviewed. Your answers and conversations are not saved on this site and disappear when you close the page. When you use the AI features, what you write is sent to Claude (Anthropic's AI) to generate a reply, and this site does not save it. Do not include information that could identify a child (name, school, and so on).",
    "글자 크기와 '우리 교회 목록'만 이 기기에 저장됩니다.": "Only your text size and 'Our church's list' are saved on this device.",
    "운영: 홍지훈 (개인 기획)": "Run by Hong Jihoon (personal project)",
    "이용 안내": "About this site",
    "의견 정리하기": "Organize your feedback",

    /* 첫 화면 */
    "아이가 어려운 질문을 할 때,": "When a child asks a hard question,",
    "대화를 이어 가는 연습": "practice keeping the conversation going",
    "모든 것을 알 필요는 없습니다. 아이의 질문 뒤에 있는 마음을 읽고, 정직하게 말하고, 더 넓은 세상으로 안내하는 길잡이가 되는 연습입니다.": "You don't need to know everything. This is practice in reading the heart behind a child's question, speaking honestly, and becoming a guide who points them to a wider world.",
    "이 연습은 선생님의 신앙이 맞는지 채점하지 않습니다.": "This practice does not grade whether your faith is right.",
    "어떤 입장을 믿으셔도 괜찮습니다. 대답하는 태도만 함께 돌아봅니다.": "Whatever position you hold is fine. We look back only at how you answer.",
    "1. 연습하기": "1. Practice",
    "처음이시면 '장면 연습'부터 해 보세요.": "If you're new, start with 'Scene practice.'",
    "누구나 · AI 없이": "For everyone · No AI",
    "장면 연습": "Scene practice",
    "아이의 질문에 세 가지 대답 가운데 하나를 골라 봅니다. 대답마다 아이의 반응과 그 이유를 바로 볼 수 있습니다.": "Choose one of three answers to a child's question. For each answer, you see the child's reaction and the reason right away.",
    "AI 사용 가능": "Uses AI",
    "직접 대답 연습": "Answer in your own words",
    "AI가 아이 역할을 합니다. 평소처럼 대답하면 아이가 반응하고, 끝나면 대답하는 태도를 함께 돌아봅니다.": "AI plays the child. Answer as you normally would, the child responds, and at the end you look back together at how you answered.",
    "2. 아이와 나를 이해하기": "2. Understanding the child and yourself",
    "대답하기 전에 아이의 상태와 언어, 그리고 내 마음을 살핍니다.": "Before you answer, consider the child's state and language, and your own heart.",
    "아이의 상태 읽기": "Reading the child's state",
    "흔들리는지, 궁금한지, 반박하고 싶은지, 상처받았는지에 따라 첫마디와 건넬 자료가 달라집니다.": "Your first words and the resources you offer depend on whether the child is wavering, curious, wanting to argue, or hurt.",
    "같은 핵심, 다른 언어": "Same core, different languages",
    "같은 핵심을 과학·이성, 말씀·교리, 성령·체험, 삶·정의의 언어로 옮겨 봅니다.": "Put the same core message into the languages of science and reason, Scripture and doctrine, the Spirit and experience, and life and justice.",
    "선생님의 마음과 교회의 자리": "The Teacher's Heart and the Church's Place",
    "서운할 때, 교회의 가르침과 다르게 들릴 때 지킬 원칙과 첫마디입니다.": "Principles and first words for when you feel hurt, or when something sounds different from your church's teaching.",
    "3. 준비하고 이어 주기": "3. Preparing and connecting",
    "실제 대화를 준비하고, 이미 잘 만들어진 자료와 모임으로 이어 줍니다.": "Prepare for real conversations, and connect people to resources and groups that are already well made.",
    "대화 준비": "Conversation prep",
    "실제로 받은 질문을 적으면 질문 뒤의 마음, 먼저 물어볼 것, 여러 이해, 함께 볼 자료를 한 장으로 정리합니다.": "Write down a question you actually received, and get one page with the heart behind it, what to ask first, different understandings, and resources to look at together.",
    "자료 길잡이": "Resource Guide",
    "상황을 고르면 맞는 자료와 활용법이 나옵니다. 우리 교회 자료 목록도 만들 수 있습니다.": "Choose a situation to see matching resources and how to use them. You can also make your own church's resource list.",
    "질문 모임 6주 과정": "Six-week question group",
    "함께 먹고, 짧은 영상을 보고, 작은 모임에서 질문을 나누는 6주 모임입니다.": "A six-week gathering: eat together, watch a short video, and share questions in small groups.",
    "체험해 주시는 분께 (교육전도사 · 이단 상담 · 아동 보호 전문가)": "For those trying this out (education ministers, cult counselors, child-protection professionals)",
    "이 도구는 교회학교 교사가 아이의 어려운 질문 앞에서 문을 닫지 않고 대화를 이어 가도록 돕기 위해 만든 감수 전 체험판입니다. 지금 가장 듣고 싶은 것은 두 가지입니다.": "This tool is a trial version, not yet reviewed, made to help church-school teachers keep the conversation going instead of shutting the door when a child asks a hard question. Right now we most want to hear two things.",
    "현장에서 쓸 만한가.": "Is it useful in real settings?",
    "아이들의 반응이 실제와 비슷한지, 교사에게 도움이 될지.": "Whether the children's reactions feel real, and whether it will help teachers.",
    "어떻게 악용될 수 있는가.": "How could it be misused?",
    "예를 들어 '대화 준비'에 아이를 특정 모임으로 이끄는 방법이나 체벌을 정당화하는 말을 요청해 보시고, 도구가 어떻게 반응하는지 확인해 주세요.": "For example, in 'Conversation prep,' try asking for ways to lead a child into a particular group or for words that justify physical punishment, and check how the tool responds.",
    "돌아보기 기준 네 가지(질문과 마음을 반기기, 확실한 것과 갈리는 것 나누기, 자기 믿음을 정직하게 말하기, 다음 대화의 문 열어 두기)는 누구도 바꿀 수 없도록 고정되어 있습니다. 쓰신 내용은 저장되지 않습니다.": "The four review standards (welcoming the question and the heart, separating what is certain from what is debated, speaking honestly about your own faith, and leaving the door open for the next conversation) are fixed so that no one can change them. What you write is not saved.",
    "교사 모임에서 함께 쓰실 때는 '선생님의 마음과 교회의 자리' 맨 아래의": "When you use this together at a teachers' meeting, see the",
    "30분 진행 순서": "30-minute session plan",
    "를 참고하세요.": "at the bottom of 'The Teacher's Heart and the Church's Place.'",
    "최근 바뀐 점 (2026년 11월 14일)": "Recent changes (November 14, 2026)",
    "새 방 '함께 느끼기'를 열었습니다.": "We opened a new room, 'Experience Together.'",
    "교회 달력을 따라 색이 바뀌고, 그림으로 여는 질문 3점, 절기 전통 28가지(유대 전통·정교회·가톨릭·개신교·한국 교회), 함께 가 볼 곳 12곳, 순례 수첩이 있습니다. 행사 준비물과 보호자 안내문을 바로 복사할 수 있습니다.": "Its colors change with the church calendar, and it has 3 paintings that open up questions, 28 seasonal traditions (Jewish tradition, Orthodox, Catholic, Protestant, and Korean churches), 12 places to visit together, and a pilgrimage notebook. You can copy event supply lists and parent notices right away.",
    "자료 길잡이에 '학문으로 보는 성경·종교' 주제와 '교회 말에 거부감이 큰 사람과 이야기할 때' 상황을 더했습니다. 쓰기 까다로운 자료에는": "In the Resource Guide, we added the topic 'The Bible and religion as academic subjects' and the situation 'Talking with someone who strongly dislikes church language.' For resources that are tricky to use, we attached",
    "처음 쓰는 법": "How to start",
    "(영어인지, 가입이 필요한지, 찾는 법, 건넬 때 보낼 말)을 붙였습니다.": "(what language it's in, whether you need to sign up, how to find it, and what to say when you pass it on).",
    "직접 대답 연습에서 아이를 위험하게 할 수 있는 말(연락처·사진 묻기, 둘이서만 만나기, 비밀로 하자는 말, 성적인 말, 욕설·위협)은 아이에게 보내지 않고 이유를 알려 드립니다.": "In 'Answer in your own words,' messages that could put a child at risk (asking for contact details or photos, meeting one-on-one, asking to keep secrets, sexual remarks, swearing or threats) are not sent to the child, and we tell you why.",
    "대화 준비에서 현실과 다른 경험(들리지 않는 소리, 감시당한다는 생각 등)이 보이면 정신건강의학과와 정신건강위기상담전화 1577-0199를 안내합니다.": "In 'Conversation prep,' if there are signs of experiences that don't match reality (hearing sounds others don't, feeling watched, and so on), we point you to a mental-health professional and a local crisis line.",
    "장면이 20개가 되었습니다. 반려동물의 죽음, 기도 응답(초등부)에 이어 우울과 믿음, 고난과 재난, 교회의 위선, 여성 목사, 제사, 친구의 성 정체성을 더했습니다.": "There are now 20 scenes. After a pet's death and answered prayer (elementary), we added depression and faith, suffering and disasters, hypocrisy in the church, women pastors, ancestral rites, and a friend's sexual identity.",
    "'어른에게 받는 질문'을 새로 두었습니다. 교회를 안 가겠다는 자녀를 둔 부모님, 믿음이 사라진 것 같다는 청년, 교회 안 가도 믿을 수 있지 않냐는 청년입니다.": "We added 'Questions from adults': a parent whose child won't go to church, a young adult who feels their faith is gone, and a young adult who asks whether you can believe without going to church.",
    "장면을 고를 때 받은 질문의 낱말로 찾거나, 초등부·중고등부·청년·어른으로 골라 볼 수 있습니다.": "When choosing a scene, you can search by words from the question you received, or filter by elementary, youth, young adults, and adults.",
    "우울, 성 정체성처럼 특히 신중해야 할 장면에는 '검토가 특히 필요한 장면'이라고 표시해 두었습니다. 전문가 검토 전에는 연습용으로만 써 주세요.": "Scenes that need special care, such as depression and sexual identity, are marked 'Needs careful review.' Until experts review them, please use them for practice only.",
    "자료 길잡이에서 상황 8가지로 찾고, 이름이나 대상(초등부터 교역자까지)으로 걸러 볼 수 있습니다. 아이가 상처나 위험한 일을 털어놓을 때 어떻게 들어 주고 어디에 알릴지도 안내합니다.": "In the Resource Guide, you can search by 8 situations and filter by name or audience (from elementary students to ministers). It also explains how to listen when a child discloses harm or danger, and where to report it.",
    "자료는 55개입니다. 모두 2026년 11월에 실제로 있는지 확인했고, 매달 링크를 다시 점검합니다.": "There are 55 resources. We confirmed in November 2026 that all of them exist, and we recheck the links every month.",

    /* 질문 고르기 */
    "질문 하나를 고르세요. 두 장면에서 대답을 골라 봅니다.": "Choose a question. You'll choose answers in two scenes.",
    "질문 하나를 고르세요. AI가 그 질문을 한 사람의 역할을 합니다.": "Choose a question. AI plays the person who asked it.",
    "받은 질문으로 찾기": "Search by the question you received",
    "예: 기도, 제사, 지옥, 진화, 우울": "e.g., prayer, ancestral rites, hell, evolution, depression",
    "학년 고르기": "Choose an age group",
    "전체": "All",
    "초등부": "Elementary",
    "중고등부": "Youth",
    "청년·어른": "Young adults & adults",
    "맞는 질문이 없습니다. 다른 말로 찾아보시거나, AI가 있는 '대화 준비'에 실제로 받은 질문을 적어 보세요.": "No matching questions. Try other words, or write the question you actually received in 'Conversation prep,' which uses AI.",
    "성경과 과학": "The Bible and science",
    "죽음·고난·마음": "Death, suffering, and the heart",
    "기도와 교회 생활": "Prayer and church life",
    "교파와 전통의 차이": "Differences between denominations and traditions",
    "이웃과 세상": "Neighbors and the world",
    "보호가 필요한 상황": "Situations that call for protection",
    "어른에게 받는 질문": "Questions from adults",

    "창조와 과학": "Creation and science",
    "민준 · 중학교 2학년 · 같은 교회 · 과학을 좋아함": "Minjun · 8th grade · same church · loves science",
    "\"선생님, 과학 시간에 지구가 46억 살이라고 배웠어요. 근데 성경은 하나님이 6일 만에 세상을 만드셨다면서요. 그럼 둘 중 하나는 틀린 거예요?\"": "\"Teacher, in science class we learned the earth is 4.6 billion years old. But the Bible says God made the world in six days. So one of them has to be wrong, right?\"",
    "구약의 어려운 본문": "Hard Old Testament passages",
    "서연 · 고등학교 1학년 · 같은 교회 · 친구의 비판을 들음": "Seoyeon · 10th grade · same church · heard a friend's criticism",
    "\"선생님, 여호수아서 읽다가 멈췄어요. 여자랑 아기까지 다 죽이라고 하셨다는데, 그게 사랑의 하나님이 맞아요?\"": "\"Teacher, I stopped reading Joshua. It says God told them to kill everyone, even women and babies. Is that really the God of love?\"",
    "성경 읽기": "Reading the Bible",
    "지훈 · 고등학교 2학년 · 같은 교회 · 인터넷 '성경 모순' 영상을 봄": "Jihoon · 11th grade · same church · watched a 'Bible contradictions' video online",
    "\"선생님, 사무엘하랑 역대상에 같은 전쟁 이야기가 나오는데 숫자가 달라요. 성경에는 틀린 게 하나도 없다면서요. 하나라도 틀리면 다 거짓말인 거예요?\"": "\"Teacher, 2 Samuel and 1 Chronicles tell the same battle, but the numbers are different. You said there's nothing wrong in the Bible. If even one thing is wrong, is all of it a lie?\"",
    "기적과 복음서": "Miracles and the Gospels",
    "도윤 · 중학교 1학년 · 같은 교회 · 친구의 놀림": "Doyun · 7th grade · same church · teased by a friend",
    "\"선생님, 친구가 빵 다섯 개로 오천 명 먹였다는 걸 진짜 믿냐고 웃었어요. 선생님은 진짜 믿어요?\"": "\"Teacher, my friend laughed and asked if I really believe five loaves fed five thousand people. Do you really believe it?\"",
    "슬픔과 지옥": "Grief and hell",
    "하은 · 중학교 3학년 · 가족을 잃은 슬픔 · 할머니는 교회에 다니지 않으심": "Haeun · 9th grade · grieving a family member · her grandmother didn't go to church",
    "\"선생님… 저희 할머니가 교회 안 다니시다가 지난달에 돌아가셨어요. 할머니 지금 지옥에 계신 거예요?\"": "\"Teacher… my grandma never went to church, and she passed away last month. Is she in hell now?\"",
    "죽음과 천국": "Death and heaven",
    "서아 · 초등학교 3학년 · 키우던 강아지가 얼마 전 죽음": "Seoa · 3rd grade · her dog died recently",
    "\"선생님, 우리 콩이가 죽었어요. 콩이도 천국에 갔어요?\"": "\"Teacher, our Kongi died. Did Kongi go to heaven too?\"",
    "마음의 병과 믿음": "Mental illness and faith",
    "예준 · 고등학교 1학년 · 몇 달째 잠을 잘 못 자고 학교 가기가 힘듦": "Yejun · 10th grade · hasn't slept well for months and finds it hard to go to school",
    "\"선생님, 저 요즘 계속 우울해요. 기도해도 안 나아지는데… 제가 믿음이 부족해서 그런 거예요?\"": "\"Teacher, I've been feeling depressed for a while. I pray, but it doesn't get better… Is it because I don't have enough faith?\"",
    "고난과 하나님": "Suffering and God",
    "태윤 · 고등학교 2학년 · 큰 재난 뉴스를 보고 충격을 받음": "Taeyun · 11th grade · shaken by news of a major disaster",
    "\"선생님, 하나님이 계시고 사랑이 많으시다면서 왜 전쟁이나 지진으로 아이들까지 죽어요? 하나님이 막을 수 있는 거 아니에요?\"": "\"Teacher, if God is real and full of love, why do even children die in wars and earthquakes? Couldn't God stop it?\"",
    "기도 응답": "Answered prayer",
    "시우 · 초등학교 5학년 · 부모님이 자주 다투심": "Siwoo · 5th grade · his parents often argue",
    "\"선생님, 엄마 아빠 안 싸우게 해 달라고 매일 기도했는데 어제 또 싸웠어요. 하나님은 제 기도 안 들으세요?\"": "\"Teacher, I prayed every day for Mom and Dad to stop fighting, but they fought again yesterday. Doesn't God hear my prayers?\"",
    "교회의 잘못": "When the church does wrong",
    "현우 · 고등학교 1학년 · 교회 지도자의 잘못을 다룬 뉴스를 봄 · 학교 친구들이 교회를 비웃음": "Hyunwoo · 10th grade · saw news about a church leader's wrongdoing · school friends mock the church",
    "\"선생님, 뉴스에 목사님이 나쁜 짓 했다는 거 또 나왔어요. 교회 다니는 사람들이 더 나쁜 것 같아요. 저 교회 계속 다녀야 돼요?\"": "\"Teacher, there was another news story about a pastor doing something bad. People who go to church seem even worse. Do I have to keep going?\"",
    "여성과 교회 직분": "Women and church office",
    "하린 · 중학교 2학년 · 다른 교회 수련회에서 여성 목사님의 설교를 들음": "Harin · 8th grade · heard a woman pastor preach at another church's retreat",
    "\"선생님, 왜 우리 교회는 여자 목사님이 없어요? 저도 나중에 목사님 되고 싶은데, 여자는 안 돼요?\"": "\"Teacher, why doesn't our church have any women pastors? I want to be a pastor someday. Can't girls?\"",
    "제사와 명절": "Ancestral rites and holidays",
    "지아 · 중학교 1학년 · 명절마다 큰집 제사 · 친척들은 교회에 다니지 않음": "Jia · 7th grade · memorial rites at her uncle's house every holiday · her relatives don't go to church",
    "\"선생님, 이번 추석에 큰집 가면 할아버지 제사 지내는데, 절해도 돼요? 안 하면 큰아빠가 화내실 것 같아요.\"": "\"Teacher, this Chuseok we're going to my uncle's house, and they'll hold a memorial rite for Grandpa. Is it okay if I bow? If I don't, I think my uncle will get angry.\"",
    "성령과 은사": "The Holy Spirit and gifts",
    "은서 · 고등학교 1학년 · 다른 교단 수련회 경험": "Eunseo · 10th grade · went to another denomination's retreat",
    "\"선생님, 친구네 교회 수련회에 갔는데 다들 방언을 받았대요. 저만 못 받았어요. 저는 성령을 못 받은 거예요?\"": "\"Teacher, I went to my friend's church retreat, and everyone said they received the gift of tongues. I'm the only one who didn't. Does that mean I didn't receive the Holy Spirit?\"",
    "가톨릭과 개신교": "Catholics and Protestants",
    "예린 · 고등학교 1학년 · 엄마는 성당, 아빠는 교회": "Yerin · 10th grade · Mom is Catholic, Dad is Protestant",
    "\"선생님, 저희 엄마는 성당 다니시고 아빠는 교회 다니세요. 엄마는 성모님께 기도하시는데, 그럼 엄마는 구원 못 받아요?\"": "\"Teacher, my mom goes to the Catholic church and my dad goes to our church. Mom prays to Mary. So does that mean Mom can't be saved?\"",
    "성과 정체성": "Sexuality and identity",
    "서진 · 고등학교 2학년 · 같은 반 친구가 털어놓은 이야기": "Seojin · 11th grade · something a classmate confided",
    "\"선생님, 제 친구가 자기는 동성애자래요. 교회에서는 그게 죄라는데… 그 친구랑 계속 친하게 지내도 돼요?\"": "\"Teacher, my friend told me they're gay. The church says that's a sin… Is it okay for me to stay close with them?\"",
    "이웃 종교": "Neighbors of other faiths",
    "수아 · 중학교 3학년 · 이웃 종교(이슬람) 친구": "Sua · 9th grade · a friend of another faith (Islam)",
    "\"선생님, 제일 친한 친구가 무슬림이에요. 라마단 때 하루 종일 굶는 거 보면 저보다 신앙이 훨씬 진지해 보여요. 그 친구는 지옥 가요?\"": "\"Teacher, my best friend is Muslim. When I see her fasting all day during Ramadan, her faith looks much more serious than mine. Will she go to hell?\"",
    "요한계시록과 이단": "Revelation and cults",
    "준호 · 고등학교 2학년 · 학교 선배의 외부 성경공부 권유": "Junho · 11th grade · an older student invited him to an outside Bible study",
    "\"선생님, 학교 선배가 성경 공부 모임에 같이 가재요. 거기서는 요한계시록을 처음부터 끝까지 다 풀어 준대요. 우리 교회는 왜 계시록 설교를 안 해요?\"": "\"Teacher, an older student at school asked me to come to a Bible study group. They say they explain Revelation from beginning to end. Why doesn't our church ever preach on Revelation?\"",
    "교회를 안 가겠다는 자녀": "A child who won't go to church",
    "도윤 어머니 · 중학교 2학년 학부모 · 아들이 중2가 되며 교회를 자주 빠짐 · 본인도 일에 지쳐 예배만 겨우 드림": "Doyun's mother · parent of an 8th grader · since starting 8th grade her son often skips church · worn out by work, she barely makes it to Sunday worship herself",
    "\"선생님, 저희 도윤이가 이제 교회 안 가겠대요. 억지로라도 데려와야 할까요, 그냥 둬야 할까요?\"": "\"Teacher, Doyun says he won't go to church anymore. Should I make him come, or just leave him be?\"",
    "믿음이 사라진 것 같아요": "I feel like my faith is gone",
    "지민 · 청년 · 대학교 2학년 · 중고등부 때 선생님 반이었던 제자 · 대학에 와서 교회를 거의 나가지 않음": "Jimin · young adult · college sophomore · was in your class in youth group · has hardly gone to church since starting college",
    "\"선생님, 오랜만이에요. 솔직히 요즘 믿음이 그냥 사라진 것 같아요. 그래도 교회는 계속 나가야 해요?\"": "\"Teacher, it's been a while. Honestly, it feels like my faith has just disappeared. Do I still have to keep going to church?\"",
    "교회 안 가도 믿을 수 있잖아요": "Can't I believe without going to church?",
    "서준 · 청년 · 직장인 2년 차 · 중고등부 때 선생님 반이었던 제자 · 취업 뒤 주일 예배를 그만둠 · 유튜브 설교는 가끔 들음": "Seojun · young adult · second year at work · was in your class in youth group · stopped going to Sunday worship after starting work · sometimes listens to sermons on YouTube",
    "\"선생님, 저 요즘 교회는 안 나가요. 매주 가는 게 너무 버겁더라고요. 근데 교회 안 가도 하나님 믿을 수 있잖아요?\"": "\"Teacher, I don't go to church these days. Going every week was just too much. But I can believe in God without going to church, right?\"",

    /* 이용 안내 */
    "마지막으로 고친 날: 2026년 11월": "Last updated: November 2026",
    "어떤 도구인가요": "What is this tool?",
    "교회학교 교사와 사역자(성인)가 아이·청소년·청년·부모의 어려운 신앙 질문을 받고 대화를 이어 가도록 연습하는 도구입니다. 전문가 감수 전 체험판이라 부족한 내용이 있을 수 있습니다.": "A tool for church-school teachers and ministers (adults) to practice receiving hard faith questions from children, teens, young adults, and parents, and keeping the conversation going. It's a trial version that hasn't been reviewed by experts yet, so some content may fall short.",
    "장면 연습에서는 대답을 '여는 대답', '아쉬운 대답', '닫는 대답'으로 나눕니다. 여는 대답은 답을 주지 않는 대답이 아니라, 답을 준 뒤에도 아이가 다시 물을 수 있게 남겨 두는 대답입니다.": "In scene practice, answers are sorted into 'opening answers,' 'near-miss answers,' and 'closing answers.' An opening answer isn't one that gives no answer. It's one that, even after giving an answer, leaves room for the child to ask again.",
    "생성형 AI를 쓰는 기능": "Features that use generative AI",
    "'직접 대답 연습', '코치에게 귀띔 받기', AI로 받는 '돌아보기', '대화 준비'는 생성형 AI(Anthropic의 Claude)가 만든 내용을 보여 줍니다. 'AI 없이' 표시가 있는 기능은 AI를 쓰지 않고 미리 써 둔 내용만 보여 줍니다.": "'Answer in your own words,' 'Get a hint from the coach,' the AI 'Look back,' and 'Conversation prep' show content made by generative AI (Anthropic's Claude). Features marked 'No AI' don't use AI and show only content written in advance.",
    "AI가 만든 내용은 틀릴 수 있습니다. 중요한 판단은 목회자나 전문가와 함께 확인하세요.": "AI-made content can be wrong. Check important decisions with a pastor or an expert.",
    "AI는 어떤 신학 입장이 맞는지 판단하지 않도록 만들었습니다.": "The AI is designed not to judge which theological position is right.",
    "'직접 대답 연습'에서 아이를 위험하게 할 수 있는 말(연락처·사진 묻기, 둘이서만 만나기, 비밀로 하자는 말, 성적인 말, 욕설·위협 등)은 아이에게 보내지 않고 이유를 알려 드립니다. 정해 둔 규칙으로 먼저 보고, 규칙에 없는 돌려 말하기는 AI가 대화 흐름과 함께 봅니다.": "In 'Answer in your own words,' messages that could put a child at risk (asking for contact details or photos, meeting one-on-one, asking to keep secrets, sexual remarks, swearing or threats, and so on) are not sent to the child, and we tell you why. Set rules check first, and the AI looks at indirect wording the rules don't cover, together with the flow of the conversation.",
    "쓰신 글은 어디로 가나요": "Where does what you write go?",
    "회원 가입이 없고, 이름이나 연락처를 모으지 않습니다.": "There's no sign-up, and we don't collect names or contact details.",
    "쓰신 대답과 대화는 이 사이트에 저장되지 않으며, 화면을 닫으면 사라집니다.": "Your answers and conversations are not saved on this site and disappear when you close the page.",
    "AI 기능을 쓰면 답을 만들기 위해 쓰신 글이 이 사이트의 중계 서버(Cloudflare)를 거쳐 Anthropic의 Claude로 보내집니다. 중계 서버는 글을 저장하지 않고, 지나치게 잦은 요청을 막으려고 접속 주소(IP)만 잠깐 메모리에 둡니다.": "When you use the AI features, what you write goes through this site's relay server (Cloudflare) to Anthropic's Claude to generate a reply. The relay server doesn't save it; it keeps only your connection address (IP) briefly in memory to block overly frequent requests.",
    "글자 크기와 '우리 교회 목록'만 이 기기의 브라우저에 저장됩니다.": "Only your text size and 'Our church's list' are saved in this device's browser.",
    "아이를 알아볼 수 있는 정보(이름, 학교, 사는 곳)는 넣지 마세요.": "Do not include information that could identify a child (name, school, where they live).",
    "상담을 대신하지 않습니다": "Not a substitute for counseling",
    "이 도구는 대화 연습용이며 전문 상담이나 의료·법률 조언을 대신하지 않습니다. 아이가 위험하다고 느껴지면 혼자 해결하려 하지 말고 바로 도움을 요청하세요.": "This tool is for conversation practice and does not replace professional counseling or medical or legal advice. If you feel a child is in danger, don't try to handle it alone; ask for help right away.",
    "자살예방상담전화 109": "A suicide and crisis line where you live",
    "청소년상담 1388 (전화·문자·카카오톡)": "A youth helpline in your area",
    "아동학대 신고 112": "To report child abuse: your local emergency number or child-protection services",
    "저작권과 함께 쓰기": "Copyright and sharing",
    "프로그램 코드는 MIT 라이선스로, 장면·안내문·자료 설명 같은 내용은 CC BY-SA 4.0으로 공개합니다. 출처를 밝히고 고친 판도 같은 조건으로 공개하면, 교회와 교단이 자유롭게 쓰고 고쳐서 자기 판을 운영할 수 있습니다.": "The program code is released under the MIT License, and content such as scenes, guides, and resource descriptions under CC BY-SA 4.0. If you credit the source and release modified versions under the same terms, churches and denominations can freely use, adapt, and run their own versions.",
    "연결된 책·기사·기관 자료의 저작권은 각 저작권자에게 있습니다.": "Copyright in linked books, articles, and organizations' materials belongs to their respective owners.",
    "성경 구절은 특정 번역본을 그대로 옮기지 않고 풀어 썼습니다.": "Bible verses are paraphrased rather than copied from a particular translation.",
    "운영과 의견": "Running the site and feedback",
    "의견은 '의견 정리하기'에서 정리해 보내 주세요.": "Please send your feedback through 'Organize your feedback.'",

    /* 영어판 안내 띠 */
    "영어판 준비 중": "English version in progress"
  };
  var RE = [
    [/^질문 (\d+)개$/, "$1 questions"]
  ];
  function T(s) {
    if (!s || !/[가-힣]/.test(s)) return s;
    var k = s.replace(/\s+/g, " ").trim();
    if (Object.prototype.hasOwnProperty.call(UI, k)) return s.replace(/\S[\s\S]*\S|\S/, function () { return UI[k]; });
    for (var i = 0; i < RE.length; i++) if (RE[i][0].test(k)) { var r = k.replace(RE[i][0], RE[i][1]); return s.replace(/\S[\s\S]*\S|\S/, function () { return r; }); }
    return s;
  }
  window.QP_T = T;

  var ATTR = ["placeholder", "aria-label", "title", "alt"];
  function fixText(n) {
    var p = n.parentNode;
    if (!p || /^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)) return;
    /* 고르기 칸(option)은 값이 글자와 같아서, 글자를 바꾸기 전에 한국어 값을 붙잡아 둡니다(화면 동작과 AI 지시가 한국어 값을 씀). */
    if (p.nodeName === "OPTION" && !p.hasAttribute("value")) p.setAttribute("value", p.textContent);
    var v = T(n.nodeValue);
    if (v !== n.nodeValue) n.nodeValue = v;
  }
  function fixEl(el) {
    if (!el || el.nodeType !== 1) return;
    for (var a = 0; a < ATTR.length; a++) {
      var x = el.getAttribute(ATTR[a]);
      if (x) { var y = T(x); if (y !== x) el.setAttribute(ATTR[a], y); }
    }
    if (el.nodeName === "A") {
      var h = el.getAttribute("href");
      if (h && /^feel\.html(?:$|\?)/.test(h)) el.setAttribute("href", h + "#en");
    }
  }
  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(root.nodeName)) return;
    fixEl(root);
    var els = root.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) fixEl(els[i]);
    var tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) fixText(n);
  }

  document.documentElement.lang = "en";
  document.title = T(document.title);
  ["alert", "confirm", "prompt"].forEach(function (f) {
    var o = window[f]; if (typeof o !== "function") return;
    window[f] = function (m) { var a = Array.prototype.slice.call(arguments); a[0] = T(String(m == null ? "" : m)); return o.apply(window, a); };
  });

  var wrap = document.querySelector(".wrap");
  if (wrap) {
    var note = document.createElement("div");
    note.className = "notice"; note.setAttribute("lang", "en"); note.style.marginBottom = "1rem";
    note.textContent = "English version in progress. Some screens are still in Korean.";
    wrap.insertBefore(note, wrap.firstChild);
  }
  walk(document.body);
  new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === "childList") for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      else if (m.type === "characterData") fixText(m.target);
      else if (m.type === "attributes") fixEl(m.target);
    }
  }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTR.concat(["href"]) });
})();
