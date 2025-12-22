---
layout: post
title: UITableViewCell Auto Height Calculation Optimization
tags:
  - iOS
  - UITableView
  - UI
  - performance
  - optimization

comments: true
---



# Background

- A live streaming chat room where many viewers can send many messages, and sending props also generates many prop messages. Assume a scenario with many messages: `5 messages per second`.
- Messages are implemented using NSAttributedString, `messages contain images and text of different sizes`.
- After messages arrive, `automatically scroll to the last message`.
- Global message list (stores the most recent 500 messages, when reaching 500, directly delete the earliest 300)

<!-- more -->

# Requirements
- Cannot consume a lot of CPU.
- Interface cannot lag when many messages arrive.

# Implementation


## Auto Calculate Height
Using a good open-source library
[UITableView-FDTemplateLayoutCell](https://github.com/forkingdog/UITableView-FDTemplateLayoutCell)

This open-source library works fine when there's less data, but when data (messages) keep increasing, it causes a huge increase in height calculations.

## Why Height Calculation Consumes CPU
Auto layout height calculation is slow. This function: `systemLayoutSizeFittingSize` is slow to calculate.


# Using estimated Doesn't Work Well

~~~
- (CGFloat)tableView:(UITableView * _Nonnull)tableView estimatedHeightForRowAtIndexPath:(NSIndexPath * _Nonnull)indexPath

~~~
Estimated height reduces a lot of height calculations, only calculating height when a Cell needs to be displayed. But many messages arriving causes Cell jitter, which looks very uncomfortable.

Because new Cells are first displayed at estimated height, if the actual required height differs from the estimated height, there will be an adjustment process after the Cell is displayed (with a simple animation effect. This effect is fine when adding one message, but if many messages arrive in short intervals, it causes Cells to jump)

# Using Cache

Cannot use IndexPath cache: If using IndexPath cache, when messages reach 500 and the earliest 300 are deleted, all Cells need to recalculate height. However, the remaining 200 messages have already been calculated.

Since messages don't change once created, calculated Cell heights can be cached in the messages.

~~~c
-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSInteger row = [indexPath row];
    MessageEntity *msg = self.data[row];
    if(msg.heightCache > 0){
   		//When cache has cached height, directly return the corresponding height
        return msg.heightCache;
    }

    CGFloat height = [tableView fd_heightForCellWithIdentifier:@"Cell" cacheByIndexPath:indexPath configuration:^(id obj) {
        MessageTableViewCell *cell = obj;
		 // Fill Cell
    }];

    msg.heightCache = height;
    return height;
}
~~~

Or, if messages have a unique id, you can use id cache.

~~~c
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    Entity *entity = self.entities[indexPath.row];
    return [tableView fd_heightForCellWithIdentifier:@"identifer" cacheByKey:entity.uid configuration:^(id cell) {
        // configurations
    }];
}
~~~

# Auto Scroll
Since messages are generated too fast, faster than scrolling to the last row. Therefore, add a delay. And filter out scroll requests that arrive before the delay.


# References
<http://blog.sunnyxx.com/2015/05/17/cell-height-calculation/>



