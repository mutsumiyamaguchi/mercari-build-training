FROM alpine

# Pythonをインストール
RUN apk update && apk add --no-cache python3 py3-pip

RUN addgroup -S mercari && adduser -S trainee -G mercari
# RUN chown -R trainee:mercari /path/to/db

USER trainee

# ここでpythonのversionを表示するように宣言しているにもかかわらず、pythonがインストールされていないので実行することができない
CMD ["python", "-V"]
