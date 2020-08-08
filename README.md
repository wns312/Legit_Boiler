## 기본 채팅기능 완료


### 참고

1. 방에 메시지를 보낼때는 roomTitle이 아닌 방의 _id를 사용한다
2. ns의 io to를 보낼때는 그냥 소켓id가 아닌 ns소켓의 id를 사용한다

### 필요목록

1. 네임스페이스 나가기 (ns멤버 목록에서 제거하고 멤버들에게 새로운 멤버목록 전송)
1) 본인이 속했던 모든 방에서 자신의 id를 제거한다 (이건 leaveRoom 재활용가능할거같은데)
2) 자신이 속했던 모든방의 모든멤버에게 멤버목록이 바뀌었음을 알린다
3) 자신이 속한 ns에서 자신의 id를 제거한다
4) ns의 모든멤버에게 멤버 목록이 바뀌었음을 알린다
5) 네임스페이스에서 나간 뒤, 본인의 네임스페이스 현재ns와 room목록과 현재 room을 꺼준다
6) 내 ns목록을 갱신한다

2. 네임스페이스 관리자 만들기 (namespace에 관리자 _id를 지정하거나 user에게 자기가 관리자인 namespace 지정(x))

3. 소켓 파일 분리가 가능할지 알아보기 (메소드들을 클래스의 함수처럼 만들어서 변수저장해서 사용할 수 있는지 알아볼 것)

4. 회원정보 수정 / css입히기 / 구글로그인같은거

5. history를 하나의 스키마로 분리하기


### 완료목록

0. aws업로드, mongoose aws에 설치하고 사용하기

1. NS중복생성 방지를 위해 서버 시작시 받아온 정보 중 nsTitle을 걸러내서 배열로 만들고
새로운 NS를 만들 때 비교 후 존재 할 경우 새로운 ns 소켓on을 만들지 않도록 해야한다 (완료)

2. 최적화를 위해서 clickns이벤트와 roomLoad이벤트를 합칠 필요가 있다 (완료. 클릭시 바로 room정보도 보내도록 변경함)

3. 방 나가기 만들기 (멤버목록에서 제거하고 멤버들에게 새로운 목록 전송)

4. room에서만 참조를 하고, ns에서는 room목록을 가지고 있지 않는것에 대해 생각해보기
(이걸 확인하려면 ns가 room을 참조하고있는걸 사용하는 경우가 있어야 한다 / 참조 안함)
보류이유 : 개발자모드에서 사용할까봐? 조건걸어 찾는건 문서가 많아지면 느릴 수 있다. 그래도...??

5. RoomModel 쿼리에서 nsTitle과 같은 것으로 찾는 경우가 많은데, 내가보기엔 이거 다 쓸데없고 네임스페이스 id로 대체할 수 있다
또한 ns_id는 서버를 켤 시 아예 ns변수에서 구할 수 있는 것으로 알고있다. 따라서 변경할 수 있으면 변경할 것 (완료)

6. nsModel에서 nsTitle과 endpoint가 중복되는데, 그냥 nsTitle만 사용하도록 변경하기

7. 비밀방을 만들고 나서 공개방을 만들면, 비밀방의 멤버가 아닌사람에게도 비밀방이 떠버리는 문제가 있다 (아주중요한 문제이므로 해결할 것)
(아무래도 새 방 목록을 받고나서 내것만 걸러서 보는게 현실적인것 같다)

8. 방이름 중복생성 문제 해결

9. history가 만약에 null이 떠도 서버가 터지지 않도록 처리하기 (null일 경우 전송실패 에러메시지를 보내거나 해서)


### 보류목록

3. 소켓의 콜백함수를 이용해서 최적화를 시도해 볼 것 (이리저리 써보고 실행흐름을 파악할 것)

4. update멤버와 콜백멤버업데이트 최적화하기 (방에있는 유저수 말하는 것)

5. 만약에 createDM과 createRoom을 합칠 수 있다면 합치기 (안해도될거같음)

10. clickRoom과 joinRoom도 합쳐보기 (setroom member생각하면 접속멤버수를 리덕스스토어에 올리거나 그냥 useEffect로 하는게 나을지도모르겠다) 
보류 이유 : 방이 로딩되고나서 history를 불러오고 메시지를 불러와야 중간에 메시지가 누락되는 일이 없을 것 같다

12. 방클릭시 history도 같이불러오는 것이 로딩 뚜두둑 여러번 되는것보다 낫지 않나싶다. (로딩 순차적으로 되는게 눈에 보이면 아마추어같음)