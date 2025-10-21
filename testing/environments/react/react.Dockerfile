FROM node:20-bookworm
WORKDIR /app
RUN npx -y playwright@1.56.1 install --with-deps
COPY . .
RUN npm install
RUN find . -type f -exec sed -i 's/from \"cc-react\"/from \"react\"/g' {} +

# just in case
RUN chmod +x environments/react/test.sh

ENTRYPOINT ["environments/react/test.sh"]