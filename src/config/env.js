const ENV = {
    // development: {
    //   API_URL: 'https://dev-api.gentooai.com/chat',
    //   CHAT_BASE_URL: 'https://dev-demo.gentooai.com',
    //   DEBUG: true
    // },
    // stage: {
    //   API_URL: 'https://stage-api.gentooai.com/chat',
    //   CHAT_BASE_URL: 'https://stage-demo.gentooai.com',
    //   DEBUG: true
    // },
    production: {
      API_URL: 'https://api.gentooai.com/chat',
      CHAT_BASE_URL: 'https://demo.gentooai.com',
      DEBUG: false
    }
  };
  
  // 기본 환경은 production으로 설정
  const getEnvironment = () => {
    // 빌드 과정에서 주입된 환경 변수가 있다면 사용
    if (process.env.NODE_ENV) {
      console.log('process.env.NODE_ENV', process.env.NODE_ENV);
      return process.env.NODE_ENV;
    }
    
    // 기본값으로 production 사용
    return 'production';
  };
  
  // const currentEnv = getEnvironment();
  const config = ENV.production;
  
  export default config;