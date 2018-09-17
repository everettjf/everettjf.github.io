---
layout: post
title: "how ios app was launched"
categories:
  - 
tags:
  - 
comments: true
---



<!-- more -->


attach to SpringBoard

![](/media/15368514201663.jpg)
SBIconController
SBHomeScreenViewController

![](/media/15368514662364.jpg)
SBRootIconListView
SBIconView

![](/media/15368519337418.jpg)




![](/media/15368521079726.jpg)

SBIconController

![](/media/15368527845129.jpg)

![](/media/15368527579673.jpg)


![](/media/15368531608777.jpg)


![](/media/15368534155570.jpg)


![](/media/15368545088473.jpg)


![](/media/15368554623070.jpg)


-[[FBWorkspaceEventQueue sharedInstance] executeOrAppendEvent:]

/Users/everettjf/Library/Developer/Xcode/iOS DeviceSupport/11.3.1 (15E302)/Symbols/System/Library/PrivateFrameworks

![](/media/15370071911618.jpg)


![](/media/15370898372741.jpg)


![](/media/15370926582651.jpg)


![](/media/15370928003987.jpg)

![](/media/15370935341668.jpg)

![](/media/15370936301648.jpg)

看来就是arrayWithObjects，然后传给executeOrInsertEvents:atPosition:




![](/media/15371087585566.jpg)


-[FBSynchronizedTransactionGroup performSynchronizedCommit]

![](/media/15371089890918.jpg)


```
<FBSynchronizedTransactionGroup: 0x1c0574c40>
    Completed: NO
    Milestones pending: 
        synchronizedCommit
    Audit history: 
        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
        TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
        TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <SBSceneLayoutWorkspaceTransaction: 0x151d125d0>
    Concurrent child transactions: 
        <SBApplicationSceneUpdateTransaction: 0x151c85a70>
            Completed: NO
            Application: <SBDeviceApplicationSceneEntity: 0x1c0c9a810; ID: com.meituan.imeituan; layoutRole: primary>
            SceneID: com.meituan.imeituan
            Display: Main
            Launch Suspended: NO
            Milestones pending: 
                synchronizedCommit
            Audit history: 
                TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                TIME: 22:42:45.626; DESCRIPTION: Beginning scene updates.
                TIME: 22:42:45.626; DESCRIPTION: Adding child transaction: <FBUpdateSceneTransaction: 0x1c41beae0>
                TIME: 22:42:45.627; DESCRIPTION: Commit preconditions satisfied.
                TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                TIME: 22:42:45.627; DESCRIPTION: Using synchronization delegate: <FBSynchronizedTransactionGroup: 0x1c0574c40>
            Concurrent child transactions: 
                <FBApplicationProcessLaunchTransaction: 0x1c0388c90>
                    Completed: NO
                    Process: <FBApplicationProcess: 0x14f684580; imeituan (com.meituan.imeituan); pid: 1168>
                    Milestones pending: 
                        processWillBeginLaunching
                        processDidFinishLaunching
                    Audit history: 
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.524; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.524; DESCRIPTION: Milestones added: processWillBeginLaunching
                        TIME: 22:42:45.524; DESCRIPTION: Life assertion removed for reason: beginning
                        TIME: 22:42:45.626; DESCRIPTION: Milestones added: processDidFinishLaunching
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
                <FBUpdateSceneTransaction: 0x1c41beae0>
                    Completed: NO
                    SceneID: com.meituan.imeituan
                    Scene Visibility: Foreground
                    Wait for Commit: YES
                    Milestones pending: 
                        synchronizedCommit
                    Audit history: 
                        TIME: 22:42:45.626; DESCRIPTION: Life assertion taken for reason: beginning
                        TIME: 22:42:45.627; DESCRIPTION: State changed from 'Initial' to 'Working'
                        TIME: 22:42:45.627; DESCRIPTION: Milestones added: synchronizedCommit
                    Concurrent child transactions: (none)
                    Serial child transactions: (none)
            Serial child transactions: (none)
    Serial child transactions: (none)
graph-base64-encoded: eyJub2RlcyI6W3sibmFtZSI6IlNCQXBwbGljYXRpb25TY2VuZVVwZGF0ZVRyYW5zYWN0aW9uIiwiTGF1bmNoIFN1c3BlbmRlZCI6Ik5PIiwiaWQiOiJTQkFwcGxpY2F0aW9uU2NlbmVVcGRhdGVUcmFuc2FjdGlvbi0weDE1MWM4NWE3MCIsInBvaW50ZXIiOiIweDE1MWM4NWE3MCIsIm1pbGVzdG9uZXNSZW1haW5pbmciOiJzeW5jaHJvbml6ZWRDb21taXQiLCJTY2VuZUlEIjoiY29tLm1laXR1YW4uaW1laXR1YW4iLCJBcHBsaWNhdGlvbiI6IjxTQkRldmljZUFwcGxpY2F0aW9uU2NlbmVFbnRpdHk6IDB4MWMwYzlhODEwOyBJRDogY29tLm1laXR1YW4uaW1laXR1YW47IGxheW91dFJvbGU6IHByaW1hcnk+Iiwic3RhdGUiOiJXb3JraW5nIn0seyJtaWxlc3RvbmVzUmVtYWluaW5nIjoic3luY2hyb25pemVkQ29tbWl0IiwiU2NlbmUgVmlzaWJpbGl0eSI6IkZvcmVncm91bmQiLCJpZCI6IkZCVXBkYXRlU2NlbmVUcmFuc2FjdGlvbi0weDFjNDFiZWFlMCIsInBvaW50ZXIiOiIweDFjNDFiZWFlMCIsIldhaXQgZm9yIENvbW1pdCI6IllFUyIsIlNjZW5lSUQiOiJjb20ubWVpdHVhbi5pbWVpdHVhbiIsInN0YXRlIjoiV29ya2luZyIsIm5hbWUiOiJGQlVwZGF0ZVNjZW5lVHJhbnNhY3Rpb24ifSx7ImlkIjoiRkJBcHBsaWNhdGlvblByb2Nlc3NMYXVuY2hUcmFuc2FjdGlvbi0weDFjMDM4OGM5MCIsInN0YXRlIjoiV29ya2luZyIsIm5hbWUiOiJGQkFwcGxpY2F0aW9uUHJvY2Vzc0xhdW5jaFRyYW5zYWN0aW9uIiwicG9pbnRlciI6IjB4MWMwMzg4YzkwIiwibWlsZXN0b25lc1JlbWFpbmluZyI6InByb2Nlc3NXaWxsQmVnaW5MYXVuY2hpbmcsIHByb2Nlc3NEaWRGaW5pc2hMYXVuY2hpbmcifSx7ImlkIjoiRkJTeW5jaHJvbml6ZWRUcmFuc2FjdGlvbkdyb3VwLTB4MWMwNTc0YzQwIiwic3RhdGUiOiJXb3JraW5nIiwibmFtZSI6IkZCU3luY2hyb25pemVkVHJhbnNhY3Rpb25Hcm91cCIsInBvaW50ZXIiOiIweDFjMDU3NGM0MCIsIm1pbGVzdG9uZXNSZW1haW5pbmciOiJzeW5jaHJvbml6ZWRDb21taXQifV0sImVkZ2VzIjpbeyJ0eXBlIjoiY2hpbGRDb25jdXJyZW50IiwidG8iOiJTQkFwcGxpY2F0aW9uU2NlbmVVcGRhdGVUcmFuc2FjdGlvbi0weDE1MWM4NWE3MCIsImZyb20iOiJGQlN5bmNocm9uaXplZFRyYW5zYWN0aW9uR3JvdXAtMHgxYzA1NzRjNDAifSx7InR5cGUiOiJjaGlsZENvbmN1cnJlbnQiLCJ0byI6IkZCQXBwbGljYXRpb25Qcm9jZXNzTGF1bmNoVHJhbnNhY3Rpb24tMHgxYzAzODhjOTAiLCJmcm9tIjoiU0JBcHBsaWNhdGlvblNjZW5lVXBkYXRlVHJhbnNhY3Rpb24tMHgxNTFjODVhNzAifSx7InR5cGUiOiJjaGlsZENvbmN1cnJlbnQiLCJ0byI6IkZCVXBkYXRlU2NlbmVUcmFuc2FjdGlvbi0weDFjNDFiZWFlMCIsImZyb20iOiJTQkFwcGxpY2F0aW9uU2NlbmVVcGRhdGVUcmFuc2FjdGlvbi0weDE1MWM4NWE3MCJ9XX0=

```




![](/media/15371092275313.jpg)


![](/media/15371100390744.jpg)

![](/media/15371100883844.jpg)
![](/media/15371102270464.jpg)

_performSynchronizedCommitIfReady

![](/media/15371103528644.jpg)


 br s -F "-[FBSynchronizedTransactionGroup _performSynchronizedCommitIfReady]"

![](/media/15371105576818.jpg)

_performSynchronizedCommit:

![](/media/15371109270304.jpg)


SBApplicationSceneUpdateTransaction

![](/media/15371110296101.jpg)




0x19746b644

![](/media/15371113010188.jpg)


![](/media/15371113156930.jpg)

![](/media/15371113253489.jpg)

第一次：

```
(lldb) po $x2
<__NSSingleObjectArrayI 0x1c4211fb0>(

<SBApplicationSceneUpdateTransaction: 0x14f5ea060>
    Completed: NO
    Application: <SBDeviceApplicationSceneEntity: 0x1c4a9dc90; ID: com.meituan.imeituan; layoutRole: primary>
    SceneID: com.meituan.imeituan
    Display: Main
    Launch Suspended: NO
    Milestones pending: 
        synchronizedCommit
    Audit history: 
        TIME: 23:22:34.569; DESCRIPTION: Life assertion taken for reason: beginning
        TIME: 23:22:34.569; DESCRIPTION: State changed from 'Initial' to 'Working'
        TIME: 23:22:34.569; DESCRIPTION: Life assertion removed for reason: beginning
        TIME: 23:22:34.609; DESCRIPTION: Beginning scene updates.
        TIME: 23:22:34.609; DESCRIPTION: Adding child transaction: <FBUpdateSceneTransaction: 0x1c03ba5c0>
        TIME: 23:22:34.610; DESCRIPTION: Commit preconditions satisfied.
        TIME: 23:22:34.610; DESCRIPTION: Milestones added: synchronizedCommit
        TIME: 23:22:34.610; DESCRIPTION: Using synchronization delegate: <FBSynchronizedTransactionGroup: 0x1c0571f40>
    Concurrent child transactions: 
        <FBApplicationProcessLaunchTransaction: 0x1c45868d0>
            Completed: NO
            Process: <FBApplicationProcess: 0x15199ebd0; imeituan (com.meituan.imeituan); pid: 1211>
            Milestones pending: 
                processWillBeginLaunching
                processDidFinishLaunching
            Audit history: 
                TIME: 23:22:34.569; DESCRIPTION: Life assertion taken for reason: beginning
                TIME: 23:22:34.569; DESCRIPTION: State changed from 'Initial' to 'Working'
                TIME: 23:22:34.569; DESCRIPTION: Milestones added: processWillBeginLaunching
                TIME: 23:22:34.569; DESCRIPTION: Life assertion removed for reason: beginning
                TIME: 23:22:34.609; DESCRIPTION: Milestones added: processDidFinishLaunching
            Concurrent child transactions: (none)
            Serial child transactions: (none)
        <FBUpdateSceneTransaction: 0x1c03ba5c0>
            Completed: NO
            SceneID: com.meituan.imeituan
            Scene Visibility: Foreground
            Wait for Commit: YES
            Milestones pending: 
                synchronizedCommit
            Audit history: 
                TIME: 23:22:34.610; DESCRIPTION: Life assertion taken for reason: beginning
                TIME: 23:22:34.610; DESCRIPTION: State changed from 'Initial' to 'Working'
                TIME: 23:22:34.610; DESCRIPTION: Milestones added: synchronizedCommit
            Concurrent child transactions: (none)
            Serial child transactions: (none)
    Serial child transactions: (none)
graph-base64-encoded: eyJub2RlcyI6W3siaWQiOiJGQkFwcGxpY2F0aW9uUHJvY2Vzc0xhdW5jaFRyYW5zYWN0aW9uLTB4MWM0NTg2OGQwIiwic3RhdGUiOiJXb3JraW5nIiwibmFtZSI6IkZCQXBwbGljYXRpb25Qcm9jZXNzTGF1bmNoVHJhbnNhY3Rpb24iLCJwb2ludGVyIjoiMHgxYzQ1ODY4ZDAiLCJtaWxlc3RvbmVzUmVtYWluaW5nIjoicHJvY2Vzc1dpbGxCZWdpbkxhdW5jaGluZywgcHJvY2Vzc0RpZEZpbmlzaExhdW5jaGluZyJ9LHsibWlsZXN0b25lc1JlbWFpbmluZyI6InN5bmNocm9uaXplZENvbW1pdCIsIlNjZW5lIFZpc2liaWxpdHkiOiJGb3JlZ3JvdW5kIiwiaWQiOiJGQlVwZGF0ZVNjZW5lVHJhbnNhY3Rpb24tMHgxYzAzYmE1YzAiLCJwb2ludGVyIjoiMHgxYzAzYmE1YzAiLCJXYWl0IGZvciBDb21taXQiOiJZRVMiLCJTY2VuZUlEIjoiY29tLm1laXR1YW4uaW1laXR1YW4iLCJzdGF0ZSI6IldvcmtpbmciLCJuYW1lIjoiRkJVcGRhdGVTY2VuZVRyYW5zYWN0aW9uIn0seyJuYW1lIjoiU0JBcHBsaWNhdGlvblNjZW5lVXBkYXRlVHJhbnNhY3Rpb24iLCJMYXVuY2ggU3VzcGVuZGVkIjoiTk8iLCJpZCI6IlNCQXBwbGljYXRpb25TY2VuZVVwZGF0ZVRyYW5zYWN0aW9uLTB4MTRmNWVhMDYwIiwicG9pbnRlciI6IjB4MTRmNWVhMDYwIiwibWlsZXN0b25lc1JlbWFpbmluZyI6InN5bmNocm9uaXplZENvbW1pdCIsIlNjZW5lSUQiOiJjb20ubWVpdHVhbi5pbWVpdHVhbiIsIkFwcGxpY2F0aW9uIjoiPFNCRGV2aWNlQXBwbGljYXRpb25TY2VuZUVudGl0eTogMHgxYzRhOWRjOTA7IElEOiBjb20ubWVpdHVhbi5pbWVpdHVhbjsgbGF5b3V0Um9sZTogcHJpbWFyeT4iLCJzdGF0ZSI6IldvcmtpbmcifV0sImVkZ2VzIjpbeyJ0eXBlIjoiY2hpbGRDb25jdXJyZW50IiwidG8iOiJGQkFwcGxpY2F0aW9uUHJvY2Vzc0xhdW5jaFRyYW5zYWN0aW9uLTB4MWM0NTg2OGQwIiwiZnJvbSI6IlNCQXBwbGljYXRpb25TY2VuZVVwZGF0ZVRyYW5zYWN0aW9uLTB4MTRmNWVhMDYwIn0seyJ0eXBlIjoiY2hpbGRDb25jdXJyZW50IiwidG8iOiJGQlVwZGF0ZVNjZW5lVHJhbnNhY3Rpb24tMHgxYzAzYmE1YzAiLCJmcm9tIjoiU0JBcHBsaWNhdGlvblNjZW5lVXBkYXRlVHJhbnNhY3Rpb24tMHgxNGY1ZWEwNjAifV19

)

```

第二次：

```
<__NSSingleObjectArrayI 0x1c021ba90>(

<FBUpdateSceneTransaction: 0x1c03ba5c0>
    Completed: NO
    SceneID: com.meituan.imeituan
    Scene Visibility: Foreground
    Wait for Commit: YES
    Milestones pending: 
        synchronizedCommit
    Audit history: 
        TIME: 23:22:34.610; DESCRIPTION: Life assertion taken for reason: beginning
        TIME: 23:22:34.610; DESCRIPTION: State changed from 'Initial' to 'Working'
        TIME: 23:22:34.610; DESCRIPTION: Milestones added: synchronizedCommit
    Concurrent child transactions: (none)
    Serial child transactions: (none)
graph-base64-encoded: eyJub2RlcyI6W3sibWlsZXN0b25lc1JlbWFpbmluZyI6InN5bmNocm9uaXplZENvbW1pdCIsIlNjZW5lIFZpc2liaWxpdHkiOiJGb3JlZ3JvdW5kIiwiaWQiOiJGQlVwZGF0ZVNjZW5lVHJhbnNhY3Rpb24tMHgxYzAzYmE1YzAiLCJwb2ludGVyIjoiMHgxYzAzYmE1YzAiLCJXYWl0IGZvciBDb21taXQiOiJZRVMiLCJTY2VuZUlEIjoiY29tLm1laXR1YW4uaW1laXR1YW4iLCJzdGF0ZSI6IldvcmtpbmciLCJuYW1lIjoiRkJVcGRhdGVTY2VuZVRyYW5zYWN0aW9uIn1dLCJlZGdlcyI6W119

)
```

-[FBSynchronizedTransactionGroup _performSynchronizedCommit:]

![](/media/15371967409858.jpg)


![](/media/15371971494585.jpg)
SBApplicationSceneUpdateTransaction performSynchronizedCommit

![](/media/15371974554253.jpg)


![](/media/15371975107656.jpg)


![](/media/15371975268068.jpg)


-[FBApplicationUpdateScenesTransaction _performSynchronizedCommit:]

![](/media/15371976746085.jpg)


+[FBSceneManager synchronizeChanges:]

![](/media/15371981536631.jpg)


-[FBSceneManager _beginSynchronizationBlock]

-[FBSceneManager _endSynchronizationBlock]

