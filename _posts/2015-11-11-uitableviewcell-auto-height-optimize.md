---
layout: post
title: UITableViewCell自动高度计算优化总结
categories: Skill
comments: true
---






# 背景

- 一个主播聊天室，大量观众能发送大量的消息，赠送一些道具也会导致产生大量的道具消息。这里假设消息很多的情况：`每秒5条消息到来`。
- 消息使用NSAttributedString实现，`消息中包含不同大小的图片和文字`。
- 消息到来后，`自动滚动到最后一条消息`。
- 全局消息列表（存储最近500条消息，到达500条后直接删除最早的300条）

<!-- more -->

# 要求
- 不能占用大量CPU。
- 在大量消息到来的情况下，界面不能卡顿。

# 功能实现


## 自动计算高度
使用一个不错的开源库
[UITableView-FDTemplateLayoutCell](https://github.com/forkingdog/UITableView-FDTemplateLayoutCell)

这个开源库在数据较少时没有问题，但当数据（消息）不断增加时，会导致高度计算量大增。

## 高度计算占用CPU的原因
自动布局的高度计算速度慢。这个函数：`systemLayoutSizeFittingSize`计算慢。


# 使用estimated效果不好

~~~
- (CGFloat)tableView:(UITableView * _Nonnull)tableView estimatedHeightForRowAtIndexPath:(NSIndexPath * _Nonnull)indexPath

~~~
估计高度，会减少很多高度的计算量，每当Cell需要显示的时候才会计算高度。但大量消息的到来会导致Cell抖动，看起来很不舒服。

因为新增Cell是先按照估计高度显示，如果实际所需高度与估计高度不同，会在Cell显示后，再有个调整高度的过程（会有个简单的动画效果。这个效果如果在新增一条消息时很不多，但如果大量消息很短的间隔到来，就会导致Cell跳动起来）

# 使用缓存

不能使用IndexPath缓存：如果使用IndexPath缓存，则当消息到达500条，删除最早300条时，会导致所有Cell都需要重新计算高度。然而，剩余的那200条消息是已经计算过的。

由于消息一旦产生就不会变化，可将计算后的Cell高度再一次缓存到消息中。

~~~c
-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    NSInteger row = [indexPath row];
    MessageEntity *msg = self.data[row];
    if(msg.heightCache > 0){
   		//当缓存有缓存的高度时，直接返回对应的高度
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

或者，如果消息有一个唯一id，可以使用id缓存。

~~~c
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    Entity *entity = self.entities[indexPath.row];
    return [tableView fd_heightForCellWithIdentifier:@"identifer" cacheByKey:entity.uid configuration:^(id cell) {
        // configurations
    }];
}
~~~

# 自动滚动
由于消息产生速度过快，比滚动到最后一行的速度还快。因此，增加个延迟。并过滤到延迟到来之前的滚动请求。


# 参考文章
http://blog.sunnyxx.com/2015/05/17/cell-height-calculation/




