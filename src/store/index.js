
export default {
    __data__:{
        isLogin:false,
        userInfo:{
            name:"",
            uId:"",
            tKey:""
        },
        api:{
            url:'115.159.25.17',
            port:3000,
            dir:'api'
        },
        devTime:30
    },
    set login(val){
        //设置用户登录信息,当设置的值是对象时，获取所需的值，写入登录状态。
        //当设置的值为 空字符串 时，表示为注销登录，则清空登录状态
        //其他情况，则失败
        if(val?.name && val?.uId){
            this.__data__.userInfo.name = val.name;
            this.__data__.userInfo.uId = val.uId;
            this.__data__.userInfo.tKey = new Date().toString();
            this.__data__.isLogin = true;
            localStorage.setItem("Flag",JSON.stringify({name:val.name,uId:val.uId,tKey:new Date().toString()}));
        }else if(val === ''){
            this.__data__.isLogin = false;
            localStorage.removeItem("Flag");
        }
    },
    get login(){
        //获取用户登录信息。1.当未登录时检查，是否在存储中存的有值。有，则返回存储的值并设置登录状态。没有，则返回false
        //2.（1）不成立时再次判断是否已登录，登录了返回登陆的用户信息，未登录则返回false
        let flag = JSON.parse(localStorage.getItem('Flag'));
        if(!this.__data__.isLogin && flag?.name && flag?.uId && flag?.tKey){
            this.__data__.userInfo.name = flag.name;
            this.__data__.userInfo.uId = flag.uId;
            this.__data__.userInfo.tKey = flag.tKey;
            this.__data__.isLogin = true;
            return flag
        }else if(this.__data__.isLogin){
            return this.__data__.userInfo;
        }else{
            this.__data__.isLogin = false;
            return false;
        }
    },
    url(name,dir){
        let _name = name ? ('/' + name) : '',_dir = (dir === undefined) ? ('/' + this.__data__.api.dir) : dir;
        return '//' + this.__data__.api.url + ':' + this.__data__.api.port + _dir + _name;
    },
    get dTime(){
        let locTime = Number(localStorage.getItem('timeDelay'));
        if(!locTime){
            //当本地不含这个值时，将默认值添加到本地，返回默认值
            localStorage.setItem('timeDelay',this.__data__.devTime);
            return this.__data__.devTime * 1000
        }else if(locTime === this.__data__.devTime){
            //当本地含有和这个值时判断其是否和默认值相同，相同则使用默认值
            return this.__data__.devTime * 1000
        }else{
            //不相同则修改默认值
            this.__data__.devTime = locTime;
            return locTime * 1000;
        }
    },
    set dTime(num){
        //只有当值不一样时才会存
        if(num !== this.__data__.devTime*1000){
            localStorage.setItem('timeDelay',num/1000);
            this.__data__.devTime = num / 1000;
        }
    }
}