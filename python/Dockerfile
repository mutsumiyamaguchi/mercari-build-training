FROM alpine

# Pythonをインストール
RUN apk update && apk add --no-cache python3 py3-pip

# 作業ディレクトリを設定(コンテナ内部の作業ディレクトリ)
WORKDIR /app

# docker buildを実行した場所にある全てのファイルをコンテナ内の/appディレクトリにコピー
COPY . /app

# 仮想環境を構築(appディレクトリにvenvダウンロード)
RUN python3 -m venv /app/venv

# 仮想環境をアクティブにして、必要なパッケージをインストール
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

RUN addgroup -S mercari && adduser -S trainee -G mercari
# sqlite3にもアクセス権限が必要と判断したため
RUN chown -R trainee:mercari /app/db/mercari.sqlite3

USER trainee


# 仮想環境内でアプリケーションを起動
CMD ["/app/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--reload", "--port", "9000"]

