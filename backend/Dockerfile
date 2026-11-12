FROM node:20-alpine
WORKDIR /app

COPY back-end/package.json back-end/package.json
RUN cd back-end && npm install

COPY logica logica
COPY back-end back-end

WORKDIR /app/back-end
EXPOSE 3000
CMD ["npm", "run", "start"]
