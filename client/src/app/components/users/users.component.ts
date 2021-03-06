import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { FollowsService } from '../../services/follows.service';
import { Follow } from '../../models/follow';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [UserService, FollowsService]
})
export class UsersComponent implements OnInit {
  public url: string;
  public title: String;
  public identity;
  public token;
  public page;
  public prevPage;
  public nextPage;
  public status;
  public total;
  public pages;
  public follows;
  public users: User[];


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _followService: FollowsService
  ) { 
    this.url = Global.url;
    this.title = "Gente";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this.actualPage();
  }

  actualPage(){
    this._route.params.subscribe(params => {
      let page = +params['page'];
      this.page = page;

      if(!+params['page']){
        page = 1;
      }

      if(!page){
        page = 1;
      }else{
        this.nextPage = page + 1;
        this.prevPage = page - 1;

        if(this.prevPage <= 0){
          this.prevPage = 1;
        }
      }

      // devolver listado de usuarios

      this.getUsers(page)
    })
  }

  getUsers(page){
    this._userService.getUsers(page).subscribe(
      response => {
        if(!response.users){
          this.status = 'error'
        }else{
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.follows = response.usersFollowing;
          if(page > this.pages){
            this._router.navigate(['gente', 1])
          }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error'
        }
      }
    )
  }

  public followUserOver;
  mouseEnter(user_id){
    this.followUserOver = user_id
  }
  mouseLeave(user_id){
    this.followUserOver = null
  }

  followUser(followed){
    let follow = new Follow('',this.identity._id, followed);

    this._followService.addFollow(this.token, follow).subscribe(
      response => {
        if(!response.follow){
          this.status = 'error'
        }else{
          this.status = 'success';
          this.follows.push(followed)
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error'
        };
      }
    )
  }

  unfollowUser(followed){
    this._followService.deleteFollow(this.token, followed).subscribe(
      response => {
        var search = this.follows.indexOf(followed);
        if(search != -1){
          this.follows.splice(search, 1);
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if(errorMessage != null){
          this.status = 'error'
        };
      }
    )
  }

}
