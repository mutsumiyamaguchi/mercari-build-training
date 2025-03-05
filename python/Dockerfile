# FROM python:3.12-alpine

# # 作業ディレクトリを設定(コンテナ内部の作業ディレクトリ)
# WORKDIR /app

# # docker buildを実行した場所にある全てのファイルをコンテナ内の/appディレクトリにコピー
# COPY . /app


# # 仮想環境をアクティブにして、必要なパッケージをインストール
# RUN pip install --no-cache-dir -r requirements.txt

# RUN apk add --no-cache sqlite


# # RUN addgroup -S mercari && adduser -S trainee -G mercari
# # sqlite3にもアクセス権限が必要と判断したため
# # RUN chown -R trainee:mercari /app/db/mercari.sqlite3

# # USER trainee


FROM python:3.12-alpine


WORKDIR /app


RUN apk add --no-cache sqlite

COPY . .

RUN pip install --no-cache-dir -r requirements.txt


EXPOSE 9000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]