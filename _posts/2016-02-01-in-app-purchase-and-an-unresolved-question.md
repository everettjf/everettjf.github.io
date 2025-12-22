---
layout: post
title: In-App Purchase Notes
categories:
  - Skill
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---



# Background

Product similar to QQ, has QQ coins. Must integrate In-App Purchase, no matter how I explained it wouldn't work.

# Pitfall

- When a created product is rejected, SKProduct's localizeTitle is nil. This is enough to crash the program in most cases.
<!-- more -->

# Tips

- Product language descriptions, don't include price (price should be obtained from price). Detailed descriptions should be detailed. After entering the App, where to click to enter the purchase page, which button to click to purchase the current product, what effect after purchase.
- Apple's product review and App review are different people.
- Apple's phone notifications and product or App review are different people.
- Apple's phone notifications are in Chinese.
- Apple will test iPhone Apps on iPad.
- Because localizeTitle is nil after product rejection causing program crash, Apple reviewers don't know this reason. They will only say they tested on many devices, always crashes, crashing programs cannot pass review.
- The phone number submitted for review must be correct, Apple will call.

# Unresolved Question

Handling one situation of IAP payment failure in multi-account Apps.
See these two questions:

- <http://stackoverflow.com/questions/34872020/apple-in-app-purchase-how-to-detect-the-owner-of-the-payment-in-an-multi-user>
- <https://segmentfault.com/q/1010000004320362>

*Will supplement here when I find a solution*

# Server-Side Tips

- Information returned by Apple server verification of receipts is reliable. Can get purchased product ID, quantity, price, etc. from here.
- If for more security, can compare again with what the client uploaded.
- Receipts may contain multiple products. (May be due to network issues last time, causing receipts to contain multiple products).
- Server side must carefully read documentation, some fields in the JSON returned by receipt verification are arrays.

