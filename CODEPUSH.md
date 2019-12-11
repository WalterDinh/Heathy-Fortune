```diff
! IOS:
#get key:
code-push deployment ls expert-ios -k
#product:
key: yYDQNdhJlJMAHQ6-wh8d2WcloZ4MbmlwQSvL-
push: code-push release-react expert-ios ios -d Production
#staging:
key: EOa7SKoP52j18vMsyGfEOXZPpd2gxFcP9uuz0p
push: code-push release-react expert-ios ios -d Staging

! ANDROID:
#get key:
code-push deployment ls expert-android -k
#product:
key: arD5rATgjjLCR8CYY1nDSXbtlzETf0RUG5QZf
push: code-push release-react expert-android android -d Production
#staging:
key: wcLdYLCMLiPc55stQKguWR2M9g-L-WY0uvWnN
push: code-push release-react expert-android android -d Staging

```
