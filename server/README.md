# Bankin Bank API Mock

This is an API used for technical tests

## Installing

```
npm install
npm start
```

The local server run on port 3000


## Infos

| Credentials       | Value  |
| ------------- | :-----|
| **login**      |  BankinUser |
| **password**      |  12345678 |
| **clientId** | BankinClientId |
| **clientSecret** | secret |


## Endpoints

- [Login](#Login)
- [Token](#Token)
- [Accounts](#Accounts)
- [Transactions](#Transactions)


---

## Login

Used to get a Refresh Token for a registered User.

**URL** : `/login`

**Method** : `POST`

**Auth required** : Authorization Basic credentials is composed of APP client_id and client_secret base 64 encoded

**Headers** : `Content-Type: application/json`

**Data constraints**

```json
{
    "user": "[valid login]",
    "password": "[password in plain text]"
}
```

#### Success Response

A token you need to refresh in order to get a working access token.

**Code** : `200 OK`

**Content example**

```json
{
    "refresh_token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

#### Error Response


**Condition** : Something get wrong with the request.

**Code** : `400 BAD REQUEST`

**Condition** : If 'login' and 'password' combination is wrong.

**Code** : `401 UNAUTHORIZED`


---


## Token

Used to get an Access Token from a Refresh Token.

**URL** : `/token`

**Method** : `POST`

**Auth required** : No

**Headers** : `Content-Type: application/x-www-form-urlencoded`

**Data constraints**

```
grant_type=refresh_token&refresh_token=<YOUR REFRESH TOKEN>
```

#### Success Response

A token to access accounts endpoints.

**Code** : `200 OK`

**Content example**

```json
{
    "access_token": "93144b288eb1fdccbe46d6fc0f241a51766ecd3d"
}
```

#### Error Response


**Condition** : Something get wrong with the request.

**Code** : `400 BAD REQUEST`

**Condition** : If your refresh token is wrong.

**Code** : `401 UNAUTHORIZED`


---


## Accounts

Get all user's accounts.

**URL** : `/accounts`

**Method** : `GET`

**Auth required** : Authorization header with Bearer token

**Headers** : `Content-Type: application/json`

#### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "account": [
        {
            "acc_number": "000000001",
            "amount": "3000",
            "currency": "EUR"
        }
    ],
    "link": null
}
```

#### Error Response

**Condition** : If access token is wrong.

**Code** : `401 UNAUTHORIZED`

---


## Transactions

Get an account's transactions, by account number

**URL** : `/accounts/<acc_number>/transactions`

**Method** : `GET`

**Auth required** : Bearer token

**Headers** : `Content-Type: application/json`

#### Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "transactions": [
        {
            "id": 1,
            "label": "label 1",
            "sign": "DBT",
            "amount": "30",
            "currency": "EUR"
        }
    ],
    "link": null
}
```


_Sign references_

| Sign label       | Meaning  |
| ------------- | -----|
| DBT      |  Debit transaction |
| CDT      |  Credit transaction |


#### Error Response

**Condition** : If access token is wrong.

**Code** : `401 UNAUTHORIZED`
