import { defineStore } from 'pinia'
import moment from 'moment';
      
interface todoItem{
  id:number,
  text:string,
  detail:string,
  isFinished:boolean,
  date:string,
  repeat:string
}
export const todos = defineStore('todos', {
  state: () => ({
    todos:[] as todoItem[],
    filter: '所有',
    nextId: 0,
    opacity:1,
    hideWhenEdge:false,
    hideHaddo:false,
  }),
  getters: {
    finishedTodos(state){
      let filterDate:todoItem[]=[]
      if(state.filter=='明天'){
        filterDate=state.todos.filter((item=>{
          // 获取明天的日期
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          tomorrow.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === tomorrow.getTime();


        }))
    
      }else if(state.filter=='最近七天'){
         filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          
          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
        
          let dateRange=[0,1,2,3,4,5,6,7]
          for(let i of dateRange){
            const today = new Date();
            today.setDate(today.getDate() + i);
            today.setHours(0, 0, 0, 0);
            if (dateToCheck.getTime() === today.getTime()){
              return true
            }

          }
          // 判断是否是明天
          return false;


        }))

      }
      else if(state.filter=='今天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          const today = new Date();

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === today.getTime();


        }))


      }else{
        filterDate=state.todos
      }
      return filterDate.filter((todo:any) => todo.isFinished)
    },
    repeatTodos(state){
      let filterDate:todoItem[]=[]
      if(state.filter=='明天'){
        filterDate=state.todos.filter((item=>{
          // 获取明天的日期
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          tomorrow.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === tomorrow.getTime();


        }))
    
      }else if(state.filter=='最近七天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          
          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
        
          let dateRange=[0,1,2,3,4,5,6,7]
          for(let i of dateRange){
            const today = new Date();
            today.setDate(today.getDate() + i);
            today.setHours(0, 0, 0, 0);
            if (dateToCheck.getTime() === today.getTime()){
              return true
            }

          }
          // 判断是否是明天
          return false;


        }))

      }
      else if(state.filter=='今天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          const today = new Date();

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === today.getTime();


        }))


      }else{
        filterDate=state.todos
      }
      
      return filterDate.filter((todo:any) => todo.repeat!=='Never'&&!todo.isFinished)
    },
    unfinishedTodosNoDate(state) {
      let filterDate:todoItem[]=[]
      if(state.filter=='明天'){
        filterDate=state.todos.filter((item=>{
          // 获取明天的日期
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          tomorrow.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === tomorrow.getTime();


        }))
    
      }else if(state.filter=='最近七天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          
          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
        
          let dateRange=[0,1,2,3,4,5,6,7]
          for(let i of dateRange){
            const today = new Date();
            today.setDate(today.getDate() + i);
            today.setHours(0, 0, 0, 0);
            if (dateToCheck.getTime() === today.getTime()){
              return true
            }

          }
          // 判断是否是明天
          return false;


        }))

      }
      else if(state.filter=='今天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          const today = new Date();

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === today.getTime();


        }))


      }else{
        filterDate=state.todos
      }
      return filterDate.filter((todo:any) => !todo.isFinished &&todo.date==''&&todo.repeat=='Never')
    },
    unfinishedTodosDate(state) {
      let filterDate:todoItem[]=[]
      if(state.filter=='明天'){
        filterDate=state.todos.filter((item=>{
          // 获取明天的日期
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          tomorrow.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === tomorrow.getTime();


        }))
    
      }else if(state.filter=='最近七天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          
          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
        
          let dateRange=[0,1,2,3,4,5,6,7]
          for(let i of dateRange){
            const today = new Date();
            today.setDate(today.getDate() + i);
            today.setHours(0, 0, 0, 0);
            if (dateToCheck.getTime() === today.getTime()){
              return true
            }

          }
          // 判断是否是明天
          return false;


        }))

      }
      else if(state.filter=='今天'){
        filterDate=state.todos.filter((item=>{
          // 获取今天天的日期
          const today = new Date();

          // 要判断的日期字符串
          const dateString =item.date;

          // 将日期字符串转换为 Date 对象
          const dateToCheck = new Date(dateString);

          // 将日期对象的时间部分设为零，只比较日期部分
          dateToCheck.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          // 判断是否是明天
          return dateToCheck.getTime() === today.getTime();


        }))


      }else{
        filterDate=state.todos
      }
      return filterDate.filter((todo:any) => !todo.isFinished &&todo.date!==''&&todo.repeat=='Never')
    }
  },
  actions: {
    setDateRange(dateRange:string){
      this.filter=dateRange
    },
    // 任何数量的参数，返回一个 Promise 或者不返回
    addTodo(newtext:string,newdate:string,repeat:string) {
      // 你可以直接改变状态
      this.todos.push({ id: this.nextId++,detail:'',text:newtext,date:newdate, isFinished: false ,repeat:repeat})
    },
    setTodoFinished(id:number){
      for(const index in this.todos){
        if(this.todos[index].id==id){
          this.todos[index].isFinished=true
          break
        }
      }
    },
    setTodoRepeatFinished(id:number){
      let newItem
      let index:number=0
      for( index;index< this.todos.length;index++){
        if(this.todos[index].id==id){
          newItem=Object.assign({}, this.todos[index])
          break
        }
      }
      newItem.id=this.nextId
      newItem.isFinished=true
      newItem.repeat='Never'
      this.nextId++
      this.todos.push(newItem)
      this.addRepeatDate(index)
    },
    addRepeatDate(index:number){
      let dateTime=moment(this.todos[index].date)
      if(this.todos[index].repeat=='Never'){
        return null
      }
      else if(this.todos[index].repeat=='Day'){
        dateTime.add(1,'d')
      }
      else if(this.todos[index].repeat=='Week'){
        dateTime.add(1,'w')
      }
      else if(this.todos[index].repeat=='Month'){
        dateTime.add(1,'M')
      }
      if(this.todos[index].date.split(' ').length==1){
         this.todos[index].date=dateTime.format('YYYY-MM-DD')
      }
      else{
        this.todos[index].date=dateTime.format('YYYY-MM-DD hh:mm')
      }
      return true
      
    },
    setTodoUnFinished(id:number){
      for(const index in this.todos){
        if(this.todos[index].id==id){
          this.todos[index].isFinished=false
          break
        }
      }
    },
    delTodo(id:number) {
      // 你可以直接改变状态
      let delindex=-1;
      for(const index in this.todos){
        if(this.todos[index].id==id){
          delindex=Number.parseInt(index) 
          break
        }
      }
      this.todos.splice(delindex, 1)
    },
  },
  persist:true
}
)