---
layout: post
title: "Startup Task Classification"
categories:
  - Performance Optimization
tags:
  - Simple
comments: true
---

An "old" App, work to do during startup continuously accumulates, code in didFinishLaunchingWithOptions gets longer and longer, AppDelegate.m file's line count also increases. Then it's time to classify and store.

<!-- more -->

Tasks during App startup can be simply divided into following categories:

1. Tasks that must initialize earliest on main thread
2. Tasks that can execute on child thread
3. Main thread tasks that can execute in parallel with tasks in 2
4. Tasks that can execute on child thread after home page displays

Then can define four types of Tasks:

```
@interface TKKTaskList : NSObject

+ (NSArray<NSString*>*)basicTasks;
+ (NSArray<NSString*>*)syncTasks;
+ (NSArray<NSString*>*)asyncTasks;
+ (NSArray<NSString*>*)asyncTasksAfterLaunch;

@end
```

Each category contains multiple Task names. Each Task corresponds to a class.

Assume each Task class has a +run method.

```
@interface Task : NSObject
@end
@implementation Task
+(void)run{
    // todo
}
@end
```


To execute these Tasks, create two serial queues.

```
        _async_queue = dispatch_queue_create("com.everettjf.asynctask", DISPATCH_QUEUE_SERIAL);
        _async_queue_after_launch = dispatch_queue_create("com.everettjf.asynctaskafterlaunch", DISPATCH_QUEUE_SERIAL);
```

Then call on corresponding queue.

```

- (void)runBasicTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList basicTasks] queue:0];
}

- (void)runAsyncTasks
{
    dispatch_async(_async_queue, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:1];
    });
}


- (void)runSyncTasks
{
    [TKKTaskManager executeTasks:[TKKTaskList syncTasks] queue:0];
}

- (void)runAsyncTasksAfterLaunch
{
    dispatch_async(_async_queue_after_launch, ^{
        [TKKTaskManager executeTasks:[TKKTaskList asyncTasks] queue:2];
    });
}

+ (void)executeTasks:(NSArray<NSString*>*) tasks queue:(int)queueType
{
    for(NSString *className in tasks){

        Class cls = NSClassFromString(className);
        if([cls respondsToSelector:@selector(run)]){
            [cls run];
        }else{
            NSLog(@"no +run for %@", className);
        }
    }
}

```

For demo, can define a bunch of Tasks:

```
#define TaskDeclare(TaskName) \
@interface TaskName : NSObject \
@end \
@implementation TaskName \
+(void)run{ usleep(arc4random() % 4 * 1000 *1000 + 1000*1000); } \
@end

@interface TTHookTask : NSObject
@end
@implementation TTHookTask
+(void)run{
    usleep(arc4random() % 4 * 1000 *1000 + 1000*1000);
}
@end


TaskDeclare(TTObserveTask)

TaskDeclare(TTAppleTask)
TaskDeclare(TTBananaTask)
TaskDeclare(TTPearTask)

TaskDeclare(TTLoginTask)
TaskDeclare(TTPrepareTask)
TaskDeclare(TTPrefetchTask)
TaskDeclare(TTProcessTask)
TaskDeclare(TTCompletionTask)
TaskDeclare(TTDoneTask)

TaskDeclare(TTDownloadTask)
TaskDeclare(TTRenderTask)

```


Finally, using os_signpost (os_signpost can reference article https://everettjf.github.io/2018/08/13/os-signpost-tutorial/ ) can see:

![](/media/15350423765697.jpg)


Example code see:

<https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/TaskSample/TaskSample/Task/TKKTaskManager.m>

Summary,

Through simple classification and reflection calls, can classify and store tasks in different files, easy to maintain, also easy to adjust task execution order.

This article is indeed simple beyond simple. A bit watery. Ha.




Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](https://everettjf.github.io/images/fun.png)
