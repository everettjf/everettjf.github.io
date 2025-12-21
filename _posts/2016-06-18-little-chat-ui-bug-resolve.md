---
layout: post
title: A Small Animation Issue When Chat Interface Keyboard Hides
categories: Skill
comments: true
---



# Background

Chat interface has two implementation methods:

1. QQ's implementation method, also most Apps' implementation method. Each message type has its own different Cell, for example: TextCell, ImageCell, etc.
2. WeChat's implementation method. Currently only know WeChat does it this way. [Implementation method see this article](https://everettjf.github.io/2016/06/19/reverse-explore-wechat-message-design).

This article mainly talks about a small UI animation issue that may be encountered with the first implementation method.
There are many reference codes on GitHub using the first implementation method (didn't find ready-made code for the second), but many codes have minor issues when actually applied.
<!-- more -->

# Approach


Since chat message avatars can be on the left or right, and message content has many types that can be left-aligned or right-aligned. If making a Cell for each combination, there will be a huge number of Cells.

- TextLeftCell
- TextRightCell
- ImageLeftCell
- ImageRightCell

**This is not good**, if there are dozens of message types, then Cells will be double that number.
(PS: What if putting two Views in one Cell? LeftView and RightView. Also not good, still troublesome.)

One solution is, in tableView's cellForRowAtIndexPath, change avatar and content View's frame position based on message type (other party's message or my message).

However there's a requirement:

1. When keyboard pops up, TableView should move up.
2. When TableView scrolls, hide keyboard.

# Problem

This is one implementation method, steps as follows:

1. When keyboard pops up, control TableView's frame **to become smaller**.
2. Add new message.
3. When TableView scrolls down, hide keyboard at the same time. Change TableView's frame **to restore original size**.

Interlude: The steps above are easy to appear, changing tableView frame size is also an easy method to think of. Of course can also use constraints, change the View below TableView's size (this constraint method is similar to changing frame size, both **bury pitfalls** for this small issue).

Final effect:

![imbug](https://everettjf.github.io/stuff/eimkit/imbug0.gif)

Problem:

**When keyboard hides, avatars and content in several Cells above in TableView will have an animation, this animation is not expected**

How to remove this animation?


# Cause

1. When keyboard hides, it hides with animation. UITableView's frame becoming larger is also in animation context, so UITableView will become larger with animation.
2. At the same time, because UITableView frame becomes larger, can accommodate more Cells, new Cells will be created, creation process is also in animation context.

# Solution

Two steps:

## Step 1

When changing frame in tableView's cellForRowAtIndexPath, disable animation.

```
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    ChatCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];

//    [self _fillCell:cell indexPath:indexPath];

    [UIView performWithoutAnimation:^{
        [self _fillCell:cell indexPath:indexPath];
    }];

    return cell;
}

```
However this is still not enough, when changing Cell size, there will still be impact.

![imbug](https://everettjf.github.io/stuff/eimkit/imbug.gif)



## Step 2

Don't change tableView size, only change position.

```
- (void)_setBottomOffset:(CGFloat)offset{
    // TableView becomes smaller
//    _bottomView.frame = CGRectMake(0, self.view.bounds.size.height - 40 - offset, self.view.bounds.size.width, 40);
//    _tableView.frame = CGRectMake(0, 0, self.view.bounds.size.width, self.view.bounds.size.height - 40 - offset);

    // TableView size unchanged, only move up
    _bottomView.frame = CGRectMake(0, self.view.bounds.size.height - 40 - offset, self.view.bounds.size.width, 40);
    _tableView.frame = CGRectMake(0, -offset, self.view.bounds.size.width, self.view.bounds.size.height - 40);
}

```

This is better.

![imbug](https://everettjf.github.io/stuff/eimkit/imbug1.gif)

## Step 3

Changing position brings a problem. When there are few messages (e.g., one), after changing position, the topmost message goes off screen. Need to adjust UITableView's contentInset:

```
    @property (nonatomic,assign) CGFloat insetTop;

    // Initial setup
    _insetTop = STATUS_BAR_HEIGHT + self.navigationController.navigationBar.bounds.size.height;
    _tableView.contentInset = UIEdgeInsetsMake(_insetTop, 0, 0, 0);

    // Respond to bottom keyboard height change
    CGFloat offset = _tableView.contentSize.height - _tableView.bounds.size.height;
    if(offset < 0){
        _tableView.contentInset = UIEdgeInsetsMake(_insetTop + height, 0, 0, 0);
    }else{
        _tableView.contentInset = UIEdgeInsetsMake(_insetTop, 0, 0, 0);
    }

```


# Summary

[Test demo here](https://github.com/everettjf/Yolo/tree/master/WeChatLikeMessageDemo/Other/ChatCellFrameChangeDemo).

Seems some third-party IM SDKs also have similar issues. Maimai app should be self-developed, also has this issue. If developers see this article, please fix it.
