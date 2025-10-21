FROM node:20-bookworm
WORKDIR /app
RUN npx -y playwright@1.56.1 install --with-deps
COPY . .
RUN npm install
RUN find . -type f -exec sed -i 's/from \"react\"/from \"cc-react\"/g' {} +

# just in case
RUN chmod +x environments/cc-react/test.sh

ENTRYPOINT ["environments/cc-react/test.sh"]