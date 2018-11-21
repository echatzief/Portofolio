-- Table: Friend_Requests
CREATE TABLE Friend_Requests (
    User_ID int  NOT NULL,
    Friend_ID int  NOT NULL,
    Status char(255)  NOT NULL,
    CONSTRAINT Friend_Requests_pk PRIMARY KEY (User_ID)
);

-- Table: Friends
CREATE TABLE Friends (
    User_ID int  NOT NULL,
    Friend_ID int  NOT NULL,
    CONSTRAINT Friends_pk PRIMARY KEY (User_ID)
);

-- Table: Messages
CREATE TABLE Messages (
    User_ID int  NOT NULL,
    Friend_ID int  NOT NULL,
    Message text  NOT NULL,
    CONSTRAINT Messages_pk PRIMARY KEY (User_ID)
);

-- Table: Users
CREATE TABLE Users (
    Username char(255)  NOT NULL,
    Password char(255)  NOT NULL,
    User_ID int  NOT NULL,
    Email char(255)  NOT NULL,
    Status char(255)  NOT NULL,
    CONSTRAINT Users_pk PRIMARY KEY (User_ID)
);

-- foreign keys
-- Reference: Friends_Users (table: Friends)
ALTER TABLE Friends ADD FOREIGN KEY (User_ID) REFERENCES Users (User_ID)  ON DELETE CASCADE ON UPDATE CASCADE;


-- Reference: Messages_Users (table: Messages)
ALTER TABLE Messages ADD FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE ON UPDATE CASCADE;

-- Reference: Users_Friend_Requests (table: Users)
ALTER TABLE Friend_Requests ADD FOREIGN KEY (User_ID) REFERENCES Users (User_ID) ON DELETE CASCADE ON UPDATE CASCADE;

-- End of file.
