import { Component, OnInit } from '@angular/core';
import { Form, OnSubmit } from '../../../shared/form/form';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _ } from '../../../core/i18n/translate';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../core/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { HttpErrorResponse } from '@angular/common/http';
import { InputComponent } from '../../../shared/form/input/input.component';
import { GroupsService } from '../groups.service';
import { GroupRequest } from '../../meetings/meetings';
import { MeetingsService } from '../../meetings/meetings.service';
import { MeetingsStateModel } from '../../meetings/store/meetings-state';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.page.html',
})
export class EditGroupPage implements Form, OnSubmit, OnInit {
  form: FormGroup;
  isLoading = false;
  loadingForm = true;
  groupId: number;
  initialValue: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly routerNavigation: NavController,
    private readonly toastService: ToastService,
    private readonly route: ActivatedRoute,
    private readonly groupsService: GroupsService,
    private readonly meetingsService: MeetingsService,
    private readonly store: Store,
  ) {
    this.form = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          InputComponent.noWhitespaceValidation(),
          Validators.minLength(3),
          Validators.maxLength(15),
          InputComponent.regex(/^[\p{L} ]+$/gu),
          InputComponent.maxWhiteSpaces(1),
        ],
      ],
    });
  }

  ngOnInit() {
    this.fillForm();
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading && !this.loadingForm) {
      this.isLoading = true;
      const form = this.form.value;
      const request: GroupRequest = {
        name: form.name.trim(),
      };

      this.groupsService.updateGroup(this.groupId, request).subscribe(
        () => {
          this.routerNavigation.navigateBack(['/app/tabs/groups']);
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.routerNavigation.navigateBack(['/app/tabs/groups']);
            this.meetingsService.findMeetings().subscribe();
          }

          this.isLoading = false;
          this.toastService.createError(
            _('A problem occurred while updating the group'),
          );
        },
      );
    }
  }

  async fillForm() {
    const groupId = +this.route.snapshot.paramMap.get('id');

    if (!groupId) {
      this.routerNavigation.navigateBack(['/app/tabs/groups']);
    }

    const meetingState: MeetingsStateModel = this.store.selectSnapshot(
      state => state.meetings,
    );

    const group = meetingState.groups.find(x => x.id === groupId);

    if (!group) {
      this.routerNavigation.navigateBack(['/app/tabs/groups']);
    }

    this.form.patchValue({
      name: group.name || '',
    });

    this.initialValue = group.name || '';
    this.groupId = groupId;
    this.loadingForm = false;
  }

  get isInitial(): boolean {
    return this.initialValue === this.form.value.name.trim().toLowerCase();
  }
}
